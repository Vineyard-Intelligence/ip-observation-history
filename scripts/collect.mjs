// One collection run: fetch every source, diff it against the last state, rewrite the state and
// merge today's delta. Designed to run from GitHub Actions twice a day (see .github/workflows).
//
//   node scripts/collect.mjs [--dry-run]
//
// Times are DAYS, not timestamps: an entry's first_seen is the day it first appeared in a collection,
// so a delayed cron shifts a date by one at worst instead of corrupting an interval.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STATE_DIR = join(ROOT, "state");
const DELTA_DIR = join(ROOT, "deltas");
// One timestamp per run. Calling Date.now() per record would make the same input produce different
// bytes every build and would still carry no extra information: the observation cadence is 12 hours.
const RUN_AT = Math.floor(Date.now() / 1000);
const RUN_ISO = new Date(RUN_AT * 1000).toISOString().slice(0, 19) + "Z"; // one value for the whole run
const TODAY = new Date(RUN_AT * 1000).toISOString().slice(0, 10);
const RETENTION_DAYS = 180;
const DRY = process.argv.includes("--dry-run");

const SOURCES = JSON.parse(readFileSync(join(ROOT, "sources.json"), "utf8"));

// A row that is simply dormant (absent today but still inside the retention window) must not be
// reported as a removal on every run. Only a row that was seen on the previous run and is now gone
// is a real removal.
const RUNS_PATH = join(DELTA_DIR, "runs.json");
const lastRunDate = existsSync(RUNS_PATH)
  ? JSON.parse(readFileSync(RUNS_PATH, "utf8")).filter((r) => r.date < TODAY).at(-1)?.date ?? null
  : null;
const BUCKETS = [...new Set(SOURCES.map((s) => s.bucket))];

// ------------------------------------------------------------------------------------------------
// Address parsing — a source is stored as a set of canonical CIDR strings.
// ------------------------------------------------------------------------------------------------

function toCidr(text) {
  const [addr, bitsRaw] = String(text).trim().split("/");
  const bits = bitsRaw === undefined || bitsRaw === "" ? 32 : Number(bitsRaw);
  const octets = addr.split(".").map(Number);
  if (octets.length !== 4) return null;
  if (octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null;
  if (!Number.isInteger(bits) || bits < 0 || bits > 32) return null;
  const start = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
  const size = 2 ** (32 - bits);
  const base = start - (start % size);
  const o = [24, 16, 8, 0].map((s) => (base >>> s) & 255);
  return `${o.join(".")}/${bits}`;
}

const lines = (text) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith(";"));

function addresses(kind, payload) {
  if (kind === "cidr") return lines(payload);
  if (kind === "ips") return lines(payload).map((ip) => `${ip}/32`);
  if (kind === "prefixes") {
    const doc = JSON.parse(payload);
    return (doc.prefixes ?? []).map((p) => p.ipv4Prefix).filter(Boolean);
  }
  if (kind === "airvpn") {
    const doc = JSON.parse(payload);
    return (doc.servers ?? [])
      .flatMap((s) => [s?.ip_v4_in1, s?.ip_v4_in2, s?.ip_v4_in3, s?.ip_v4_in4])
      .filter(Boolean)
      .map((ip) => `${ip}/32`);
  }
  return [];
}

/**
 * The commit a git-hosted source currently points at, so a row discovered today can name the exact
 * file it was read from. `git ls-remote` needs no API token and one call per repository, not per
 * source. Sources that are APIs (VPN providers, vendor JSON feeds) have no repo and stay null.
 */
async function branchTip(repo, branch) {
  try {
    const out = execFileSync("git", ["ls-remote", `https://github.com/${repo}.git`, `refs/heads/${branch}`], {
      encoding: "utf8",
      timeout: 30_000,
    });
    const sha = out.trim().split(/\s+/)[0];
    return /^[0-9a-f]{40}$/.test(sha) ? sha.slice(0, 8) : null;
  } catch {
    return null;
  }
}

async function fetchText(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "ip-classification-history/1.0" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.text();
    } catch (e) {
      if (i === tries - 1) throw new Error(`${url}: ${e.message}`);
      await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
    }
  }
}

// ------------------------------------------------------------------------------------------------
// State
// ------------------------------------------------------------------------------------------------

/** state/<bucket>.json — { coverage_start, sources: { label: { url, entries: { cidr: [first,last] } } } } */
function loadState(bucket) {
  const path = join(STATE_DIR, `${bucket}.json`);
  if (!existsSync(path)) return { coverage_start: TODAY, sources: {} };
  return JSON.parse(readFileSync(path, "utf8"));
}

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

async function main() {
  mkdirSync(STATE_DIR, { recursive: true });
  mkdirSync(DELTA_DIR, { recursive: true });

  const tips = new Map();
  const parse = (url) => url.match(/raw\.githubusercontent\.com\/([^/]+\/[^/]+)\/([^/]+)\//);
  for (const src of SOURCES) {
    const m = parse(src.url);
    if (!m) continue;
    const key = `${m[1]}@${m[2]}`;
    if (!tips.has(key)) tips.set(key, await branchTip(m[1], m[2]));
  }

  const results = new Map();
  const failures = [];
  const queue = [...SOURCES];

  const worker = async () => {
    while (queue.length) {
      const src = queue.shift();
      try {
        const text = await fetchText(src.url);
        const set = new Set();
        for (const a of addresses(src.kind, text)) {
          const cidr = toCidr(a);
          if (cidr) set.add(cidr);
        }
        results.set(src.label, set);
        process.stdout.write(".");
      } catch (e) {
        failures.push({ label: src.label, error: e.message });
        process.stdout.write("x");
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  console.log("");

  const delta = { date: TODAY, at: RUN_AT, added: {}, removed: {} };
  let totalEntries = 0;
  let added = 0;
  let removed = 0;
  let pruned = 0;

  for (const bucket of BUCKETS) {
    const state = loadState(bucket);
    const before = JSON.parse(JSON.stringify(state.sources));

    for (const src of SOURCES.filter((s) => s.bucket === bucket)) {
      const seen = results.get(src.label);
      if (!seen) continue; // a failed fetch must not look like a removal

      const prev = state.sources[src.label] ?? { url: src.url, entries: {} };
      const entries = prev.entries ?? {};
      const next = {};

      for (const cidr of seen) {
        const row = entries[cidr];
        if (row) {
          // [first_seen, last_seen, prov, ref_first, ref_last, first_observed]
          // A backfilled row keeps its provenance and refs; observing it now fills first_observed.
          next[cidr] = [row[0], RUN_ISO, row[2], row[3], row[4], row[5] ?? RUN_ISO];
        } else {
          // Discovered by us: this day is both the first appearance we know of and our first sighting.
          // At bootstrap everything is inherited, so first_seen stays null (see coverage_start).
          const inherited = state.coverage_start === TODAY;
          const m = parse(src.url);
          const tip = m ? tips.get(`${m[1]}@${m[2]}`) ?? null : null;
          next[cidr] = [inherited ? null : RUN_ISO, RUN_ISO, "o", tip, tip, RUN_ISO];
          added++;
          (delta.added[src.label] ??= []).push(cidr);
        }
      }
      for (const [cidr, row] of Object.entries(entries)) {
        if (seen.has(cidr)) continue;
        if (row[1] && daysBetween(row[1], TODAY) > RETENTION_DAYS) {
          pruned++;
          continue;
        }
        next[cidr] = row; // absent today, but still inside the retention window
        if (row[1] === lastRunDate) {
          removed++;
          (delta.removed[src.label] ??= []).push(cidr);
        }
      }

      state.sources[src.label] = { url: src.url, entries: next };
      totalEntries += Object.keys(next).length;
    }

    if (JSON.stringify(before) !== JSON.stringify(state.sources) && !DRY) {
      writeFileSync(join(STATE_DIR, `${bucket}.json`), JSON.stringify(state, null, 0) + "\n");
    }
  }

  // Merge into today's delta file: the day has two runs, so this must read-modify-write.
  const deltaPath = join(DELTA_DIR, `${TODAY}.json`);
  const existing = existsSync(deltaPath) ? JSON.parse(readFileSync(deltaPath, "utf8")) : { date: TODAY, added: {}, removed: {} };
  for (const [label, list] of Object.entries(delta.added)) {
    existing.added[label] = [...new Set([...(existing.added[label] ?? []), ...list])];
  }
  for (const [label, list] of Object.entries(delta.removed)) {
    existing.removed[label] = [...new Set([...(existing.removed[label] ?? []), ...list])];
  }
  if (!DRY) writeFileSync(deltaPath, JSON.stringify(existing) + "\n");

  const summary = {
    date: TODAY,
    at: RUN_AT,
    collected: results.size,
    failed: failures.map((f) => f.label),
    entries: totalEntries,
    added,
    removed,
    pruned,
  };
  if (!DRY) {
    const runsPath = RUNS_PATH;
    const runs = existsSync(runsPath) ? JSON.parse(readFileSync(runsPath, "utf8")) : [];
    runs.push(summary);
    writeFileSync(runsPath, JSON.stringify(runs.slice(-500), null, 0) + "\n");
  }

  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) console.error("failed:", failures);
  if (failures.length === SOURCES.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
