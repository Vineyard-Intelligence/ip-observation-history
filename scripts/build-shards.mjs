// Turns state/*.json into the lookup index the plugin reads.
//
//   node scripts/build-shards.mjs
//
//   shards/<o1>.json   the records whose range starts in that /8, sorted by start
//   index.json         source names → urls, per-shard row counts, empty-/8 bitmap, build time
//
// Sharding key is the FIRST OCTET of the queried address, so a lookup fetches exactly one file. A
// range that crosses an /8 boundary is clipped into each shard it covers and therefore appears more
// than once — an address still lands in exactly one shard, so lookups never miss.
//
// Record: [tag, ref_first, ref_last, first_observed_at, first_seen_at, last_seen_at]
//   tag                 source name (see index.json for its url)
//   ref_first/ref_last  short commit SHAs in a git-hosted source, null otherwise
//   timestamps          epoch seconds (UTC), null = unknown
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STATE_DIR = join(ROOT, "state");
const OUT_DIR = join(ROOT, "shards");
const INDEX = join(ROOT, "index.json");
const BUCKETS = ["scanners", "c2", "bots", "anonymizer", "bogon"];

const toInt = (a) => {
  const o = a.split(".").map(Number);
  return ((o[0] << 24) >>> 0) + (o[1] << 16) + (o[2] << 8) + o[3];
};
// State rows hold a plain date for git-derived values and a full timestamp for observations.
const epoch = (d) => (d ? Math.floor(Date.parse(d.length === 10 ? `${d}T00:00:00Z` : d) / 1000) : null);

const urls = new Map();
const shards = new Map(); // o1 -> [{start,end,rec}]

for (const bucket of BUCKETS) {
  const path = join(STATE_DIR, `${bucket}.json`);
  if (!existsSync(path)) continue;
  const state = JSON.parse(readFileSync(path, "utf8"));
  for (const [label, src] of Object.entries(state.sources)) {
    urls.set(label, { source: src.url, bucket });
    for (const [cidr, row] of Object.entries(src.entries ?? {})) {
      const [addr, bitsRaw] = cidr.split("/");
      const bits = Number(bitsRaw);
      const start = toInt(addr);
      const end = start + 2 ** (32 - bits) - 1;
      const rec = [label, row?.[3] ?? null, row?.[4] ?? null, epoch(row?.[5]), epoch(row?.[0]), epoch(row?.[1])];

      let cur = start;
      while (cur <= end) {
        const o1 = cur >>> 24;
        // (o1 + 1) << 24 overflows at o1 = 255 and yields 0, which loops forever on 240.0.0.0/4.
        const edge = Math.min(end, (o1 + 1) * 2 ** 24 - 1);
        if (!shards.has(o1)) shards.set(o1, []);
        shards.get(o1).push({ start: cur, end: edge, rec });
        cur = edge + 1;
      }
    }
  }
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const index = {
  built_at: Math.floor(Date.now() / 1000),
  record: ["tag", "ref_first", "ref_last", "first_observed_at", "first_seen_at", "last_seen_at"],
  // name → { source, bucket }: the plugin needs both to write a field and to pick the category tag.
  sources: Object.fromEntries([...urls.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  shards: {},
  empty_bitmap: "",
};

const bitmap = new Uint8Array(32);
let rows = 0;
let bytes = 0;

for (const [o1, list] of [...shards.entries()].sort((a, b) => a[0] - b[0])) {
  list.sort((a, b) => a.start - b.start || a.end - b.end);
  const obj = {};
  for (const { start, end, rec } of list) {
    const key = start === end ? intToIp(start) : `${intToIp(start)}/${32 - Math.log2(end - start + 1)}`;
    (obj[key] ??= []).push(rec);
  }
  const text = JSON.stringify(obj);
  const name = String(o1).padStart(3, "0");
  writeFileSync(join(OUT_DIR, `${name}.json`), text + "\n");
  index.shards[name] = list.length;
  bitmap[o1 >> 3] |= 1 << (o1 & 7);
  rows += list.length;
  bytes += text.length;
}

index.empty_bitmap = Buffer.from(bitmap).toString("base64");
writeFileSync(INDEX, JSON.stringify(index, null, 0) + "\n");

console.log(`shards: ${shards.size}, rows: ${rows.toLocaleString()}, payload: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`index.json: ${(JSON.stringify(index).length / 1024).toFixed(1)} KB, sources: ${urls.size}`);
console.log(`coverage_start: ${BUCKETS.map((b) => JSON.parse(readFileSync(join(STATE_DIR, `${b}.json`), "utf8")).coverage_start).find(Boolean)}`);

function intToIp(n) {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}
