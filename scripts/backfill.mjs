// One-off bootstrap: reconstruct first_seen/last_seen from the git history of the sources that have
// one. Run ONCE, before the collector's first run. It merges and never overwrites an observation the
// collector made itself.
//
//   node scripts/backfill.mjs [--buckets=c2,anonymizer] [--since=2024-01-01] [--dry-run]
//
// Replay model: `git log -p` gives +/- lines, not file contents. Tracking the running set (add on
// "+", remove on "-") yields the true first appearance and the true last presence — counting only "+"
// lines reports "last re-added", which silently shortens every long-lived entry (78% of them).
//
// Only sources served from raw.githubusercontent.com have history. Provider APIs (NordVPN, Mullvad,
// …), the crawler JSONs, Team Cymru and FireHOL (single squashed commit) do not.
//
// Row layout in state/<bucket>.json:
//   [first_seen, last_seen, prov, ref_first, ref_last, first_observed]
// first_observed stays null here: these entries existed before we started watching.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STATE_DIR = join(ROOT, "state");
const ARCHIVE_DIR = join(ROOT, "archive");
const CACHE_DIR = join(ROOT, ".cache");
const TODAY = new Date().toISOString().slice(0, 10);
const RETENTION_DAYS = 180;
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const onlyBuckets = (args.find((a) => a.startsWith("--buckets=")) ?? "").split("=")[1]?.split(",").filter(Boolean);
const since = args.find((a) => a.startsWith("--since="))?.split("=")[1] ?? null;

const SOURCES = JSON.parse(readFileSync(join(ROOT, "sources.json"), "utf8"));
const BUCKETS = [...new Set(SOURCES.map((s) => s.bucket))].filter((b) => !onlyBuckets || onlyBuckets.includes(b));

/** raw.githubusercontent.com/<org>/<repo>/<ref>/<path> → { repo, path } */
function gitTarget(url) {
  const u = new URL(url);
  if (u.host !== "raw.githubusercontent.com") return null;
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length < 4) return null;
  return { repo: `${parts[0]}/${parts[1]}`, path: parts.slice(3).map(decodeURIComponent).join("/") };
}

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
  return `${[24, 16, 8, 0].map((s) => (base >>> s) & 255).join(".")}/${bits}`;
}

function clone(repo) {
  const dir = join(CACHE_DIR, repo.replace("/", "__"));
  if (existsSync(join(dir, ".git"))) return dir;
  mkdirSync(CACHE_DIR, { recursive: true });
  process.stdout.write(`  cloning ${repo} …`);
  execFileSync("git", ["clone", "--quiet", "--no-checkout", `https://github.com/${repo}.git`, dir], { stdio: "ignore" });
  console.log(" done");
  return dir;
}

/** FireHOL force-pushes a single squashed commit, so every row would get the same date. */
function hasHistory(dir) {
  try {
    return Number(execFileSync("git", ["-C", dir, "rev-list", "--count", "HEAD"], { encoding: "utf8" }).trim()) >= 3;
  } catch {
    return false;
  }
}

/**
 * Replays one file's history.
 * Returns Map<cidr, { first, last, firstRef, lastRef }> — dates as YYYY-MM-DD, refs as short SHAs.
 */
function replay(dir, path) {
  const logArgs = ["-C", dir, "log", "--reverse", "-p", "--format=COMMIT %H %aI", "--", path];
  if (since) logArgs.splice(3, 0, `--since=${since}`);
  const out = execFileSync("git", logArgs, { encoding: "utf8", maxBuffer: 1024 * 1024 * 1024 });

  const seen = new Map();
  const current = new Set();
  let day = null;
  let sha = null;

  // Whatever is still in the set when a commit's diff ends was present at that commit. Settling with
  // the commit that just finished (not the previous one) is what keeps entries that lived for a single
  // commit — 3,200 of them in the scanner bucket — from ending up with no last_seen at all.
  const settle = () => {
    if (!day) return;
    for (const cidr of current) seen.set(cidr, { ...(seen.get(cidr) ?? {}), last: day, lastRef: sha });
  };

  for (const line of out.split("\n")) {
    if (line.startsWith("COMMIT ")) {
      settle();
      const [, hash, iso] = line.split(" ");
      sha = hash;
      day = iso.slice(0, 10);
      continue;
    }
    if (line.startsWith("---") || line.startsWith("+++")) continue;
    const sign = line[0];
    if (sign !== "+" && sign !== "-") continue;
    const cidr = toCidr(line.slice(1));
    if (!cidr) continue;
    if (sign === "+") {
      if (!current.has(cidr)) {
        current.add(cidr);
        if (!seen.has(cidr)) seen.set(cidr, { first: day, firstRef: sha });
      }
    } else {
      current.delete(cidr);
    }
  }
  settle();
  return seen;
}

function main() {
  const byBucket = new Map(BUCKETS.map((b) => [b, []]));
  for (const src of SOURCES) {
    if (!byBucket.has(src.bucket)) continue;
    if (!gitTarget(src.url)) continue;
    byBucket.get(src.bucket).push(src);
  }

  let imported = 0;
  let archived = 0;
  for (const [bucket, list] of byBucket) {
    if (!list.length) continue;
    console.log(`${bucket}: ${list.length} source(s)`);
    const statePath = join(STATE_DIR, `${bucket}.json`);
    const state = existsSync(statePath)
      ? JSON.parse(readFileSync(statePath, "utf8"))
      : { coverage_start: TODAY, sources: {} };

    for (const src of list) {
      const target = gitTarget(src.url);
      const dir = clone(target.repo);
      if (!hasHistory(dir)) {
        console.log(`  ${src.label.padEnd(26)} skipped — squashed history (no per-commit dates)`);
        continue;
      }
      const started = Date.now();
      const seen = replay(dir, target.path);

      const prev = state.sources[src.label];
      const entries = { ...(prev?.entries ?? {}) };
      const dormant = {};
      let active = 0;
      let old = 0;

      for (const [cidr, rec] of seen) {
        const existing = entries[cidr];
        if (existing && existing[2] !== "g") continue; // never overwrite an observation
        const row = [rec.first ?? null, rec.last ?? null, "g", rec.firstRef ?? null, rec.lastRef ?? null, null];
        if (rec.last && daysBetween(rec.last, TODAY) > RETENTION_DAYS) {
          dormant[cidr] = [rec.first ?? null, rec.last, rec.firstRef ?? null, rec.lastRef ?? null];
          old++;
        } else {
          entries[cidr] = row;
          active++;
        }
      }

      state.sources[src.label] = {
        url: src.url,
        backfill: { at: TODAY, since, repo: target.repo, path: target.path, seen: seen.size },
        entries,
      };
      imported += active;
      archived += old;

      if (old && !DRY) {
        const name = src.label.replace(/[^a-z0-9]+/g, "-");
        const path = join(ARCHIVE_DIR, `${bucket}--${name}.json`);
        mkdirSync(ARCHIVE_DIR, { recursive: true });
        const merged = existsSync(path)
          ? { ...JSON.parse(readFileSync(path, "utf8")).entries, ...dormant }
          : dormant;
        writeFileSync(path, JSON.stringify({ label: src.label, source: src.url, entries: merged }) + "\n");
      }

      console.log(
        `  ${src.label.padEnd(26)} ${String(seen.size).padStart(5)} in git — ` +
          `${String(active).padStart(5)} active, ${String(old).padStart(5)} archived, ` +
          `${((Date.now() - started) / 1000).toFixed(1)}s`,
      );
    }

    if (!DRY) {
      mkdirSync(STATE_DIR, { recursive: true });
      writeFileSync(statePath, JSON.stringify(state) + "\n");
    }
  }

  console.log(`\nactive ${imported}, archived ${archived}${DRY ? " (dry run)" : " → state/ + archive/"}`);
}

main();
