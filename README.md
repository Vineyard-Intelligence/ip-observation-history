# IP Observation History

The time dimension for IP classification. For every address it keeps the first and last moment a
source listed it, plus the upstream commit that said so. This is data, not a plugin.

## Data sources

The same 81 sources the [IP Classification](https://github.com/Vineyard-Intelligence/pluginpack-ip-classification)
pack uses. Sources hosted on GitHub can be replayed through their commit history; the rest publish
current state only.

<!-- sources:start -->
| | Sources | Ranges | Per run |
|---|---:|---:|---:|
| fetched every run | 49 | 23,639 | **94 KiB** |
| bundled snapshot | 32 | 13,994 | 0 (inside the 96 KiB bundle) |
| **total** | **81** | **37,633** | |

Sources whose content changes often are fetched on every run; the rest ship inside the bundle.
Sizes are gzip bytes. Regenerate with npm run sources.

### Scanners

| Name | Value | Source | Ranges | gzip | Last update |
|---|---|---|---:|---:|---|
| Stretchoid | `stretchoid` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/strechoid_v4.txt> | 7,278 | 21 KiB | 2026-10-22 08:04 UTC (2d ago) |
| Hunter | `hunter` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/hunter_v4.txt> | 3,614 | 11 KiB | 2026-10-15 00:45 UTC (9d ago) |
| BinaryEdge | `binaryedge` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/binaryedge_v4.txt> | 3,201 | 13 KiB | 2026-09-08 07:45 UTC (46d ago) |
| Quake | `quake` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/quake_v4.txt> | 685 | 2 KiB | 2026-10-15 00:45 UTC (9d ago) |
| FOFA | `fofa` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/fofa_v4.txt> | 408 | 1 KiB | 2026-10-15 00:45 UTC (9d ago) |
| Mandiant | `mandiant` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/mandiantasm_v4.txt> | 107 | — | 2026-03-29 20:28 UTC (208d ago) |
| LeakIX | `leakix` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/leakix_v4.txt> | 94 | — | 2025-11-20 02:27 UTC (338d ago) |
| Tenable | `tenable` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/tenableasm_v4.txt> | 92 | — | 2026-03-29 20:28 UTC (208d ago) |
| Shodan | `shodan` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/shodan_v4.txt> | 80 | — | 2025-12-06 16:54 UTC (322d ago) |
| VirusTotal | `virustotal` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/virustotal_v4.txt> | 58 | — | 2026-10-22 08:04 UTC (2d ago) |
| Netlas | `netlas` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/netlas_v4.txt> | 31 | — | 2026-03-29 20:28 UTC (208d ago) |
| Group-IB | `group_ib` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/groupib_v4.txt> | 19 | 112 B | 2026-10-15 00:45 UTC (9d ago) |
| Censys | `censys` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/censys_v4.txt> | 16 | — | 2026-03-29 15:00 UTC (209d ago) |
| ZoomEye | `zoomeye` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/zoomeye_v4.txt> | 13 | — | 2025-11-26 05:58 UTC (332d ago) |
| ONYPHE | `onyphe` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/onyphe_v4.txt> | 10 | — | 2026-03-29 20:28 UTC (208d ago) |
| Shadowserver | `shadowserver` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/shadowserver_v4.txt> | 10 | — | 2026-10-15 00:45 UTC (9d ago) |
| Rapid7 | `rapid7` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/rapid7_v4.txt> | 9 | — | 2026-06-12 05:38 UTC (134d ago) |
| Palo Alto Expanse | `palo_alto_expanse` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/paloaltonetworks_v4.txt> | 8 | — | 2026-06-12 05:38 UTC (134d ago) |
| Recorded Future | `recorded_future` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/recordedfuture_v4.txt> | 6 | — | 2026-03-03 17:43 UTC (235d ago) |
| Bitsight | `bitsight` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/bitsight_v4.txt> | 5 | — | 2025-11-26 05:58 UTC (332d ago) |
| Intrinsec | `intrinsec` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/intrinsec_v4.txt> | 5 | — | 2025-11-20 02:27 UTC (338d ago) |
| Criminal IP | `criminal_ip` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/criminalip_v4.txt> | 1 | — | 2025-11-20 02:27 UTC (338d ago) |

### C2 / malware

| Name | Value | Source | Ranges | gzip | Last update |
|---|---|---|---:|---:|---|
| GoPhish | `gophish` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/GoPhish%20IPs.txt> | 1,072 | 6 KiB | 2026-10-24 04:59 UTC (today) |
| Sliver | `sliver` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Sliver%20C2%20IPs.txt> | 610 | 4 KiB | 2026-10-24 04:59 UTC (today) |
| Metasploit | `metasploit` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Metasploit%20Framework%20C2%20IPs.txt> | 257 | 2 KiB | 2026-10-24 04:59 UTC (today) |
| Viper | `viper` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Viper%20C2%20IPs.txt> | 253 | 559 B | 2026-10-24 04:59 UTC (today) |
| Cobalt Strike | `cobalt_strike` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Cobalt%20Strike%20C2%20IPs.txt> | 154 | 995 B | 2026-10-24 04:59 UTC (today) |
| PANDA | `panda` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/PANDA%20C2%20IPs.txt> | 144 | 936 B | 2026-10-24 04:59 UTC (today) |
| Hak5 Cloud C2 | `hak5_cloud_c2` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Hak5%20Cloud%20C2%20IPs.txt> | 86 | 576 B | 2026-10-24 04:59 UTC (today) |
| BurpSuite | `burpsuite` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/BurpSuite%20IPs.txt> | 83 | 599 B | 2026-10-24 04:59 UTC (today) |
| Mythic | `mythic` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Mythic%20C2%20IPs.txt> | 69 | 477 B | 2026-10-24 04:59 UTC (today) |
| XMRig | `xmrig` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/XMRig%20Monero%20Cryptominer%20IPs.txt> | 44 | 325 B | 2026-10-24 04:59 UTC (today) |
| Havoc | `havoc` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Havoc%20C2%20IPs.txt> | 39 | 288 B | 2026-10-24 04:59 UTC (today) |
| Sectop | `sectop` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Sectop%20RAT%20IPs.txt> | 38 | 255 B | 2026-10-24 04:59 UTC (today) |
| Supershell | `supershell` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Supershell%20C2%20IPs.txt> | 34 | 255 B | 2026-10-24 04:59 UTC (today) |
| ShadowPad | `shadowpad` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/ShadowPad%20IPs.txt> | 30 | 203 B | 2026-10-24 04:59 UTC (today) |
| RedGuard | `redguard` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/RedGuard%20C2%20IPs.txt> | 15 | 130 B | 2026-10-24 04:59 UTC (today) |
| AsyncRAT | `asyncrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/AsyncRAT%20IPs.txt> | 12 | 108 B | 2026-10-24 04:59 UTC (today) |
| XtremeRAT | `xtremerat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/XtremeRAT%20Trojan%20IPs.txt> | 12 | 112 B | 2026-10-24 04:59 UTC (today) |
| Unam Web Panel | `unam_web_panel` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Unam%20Web%20Panel%20IPs.txt> | 11 | 109 B | 2026-10-24 04:59 UTC (today) |
| Gh0st | `gh0st` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Gh0st%20RAT%20Trojan%20IPs.txt> | 10 | 105 B | 2026-10-24 04:59 UTC (today) |
| DarkComet | `darkcomet` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/DarkComet%20Trojan%20IPs.txt> | 7 | 82 B | 2026-10-24 04:59 UTC (today) |
| Brute Ratel C4 | `brute_ratel_c4` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Brute%20Ratel%20C4%20IPs.txt> | 6 | 74 B | 2026-10-24 04:59 UTC (today) |
| NanoCore | `nanocore` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NanoCore%20RAT%20Trojan%20IPs.txt> | 6 | 74 B | 2026-10-24 04:59 UTC (today) |
| njRAT | `njrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/njRAT%20Trojan%20IPs.txt> | 4 | 62 B | 2026-10-24 04:59 UTC (today) |
| Posh | `posh` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Posh%20C2%20IPs.txt> | 4 | 64 B | 2026-10-24 04:59 UTC (today) |
| Covenant | `covenant` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Covenant%20C2%20IPs.txt> | 3 | 56 B | 2026-10-24 04:59 UTC (today) |
| DcRAT | `dcrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/DcRAT%20IPs.txt> | 3 | 59 B | 2026-10-23 20:05 UTC (today) |
| NimPlant | `nimplant` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NimPlant%20C2%20IPs.txt> | 3 | 54 B | 2026-10-23 20:05 UTC (today) |
| Quasar | `quasar` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Quasar%20RAT%20IPs.txt> | 3 | 58 B | 2026-10-24 04:59 UTC (today) |
| Remcos | `remcos` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Remcos%20RAT%20IPs.txt> | 3 | 56 B | 2026-10-24 04:59 UTC (today) |
| Caldera | `caldera` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Caldera%20C2%20IPs.txt> | 2 | 50 B | 2026-10-24 04:59 UTC (today) |
| Hookbot | `hookbot` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Hookbot%20IPs.txt> | 2 | 48 B | 2026-10-23 20:05 UTC (today) |
| NetBus | `netbus` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NetBus%20Trojan%20IPs.txt> | 2 | 50 B | 2026-10-23 20:05 UTC (today) |
| Deimos | `deimos` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Deimos%20C2%20IPs.txt> | 1 | 31 B | 2026-09-22 19:54 UTC (31d ago) |
| Empire | `empire` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Empire%20C2%20IPs.txt> | 1 | 34 B | 2026-10-05 17:25 UTC (19d ago) |
| MobSF | `mobsf` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/MobSF%20IPs.txt> | 1 | 33 B | 2026-10-09 21:12 UTC (14d ago) |
| Villain | `villain` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Villain%20C2%20IPs.txt> | 1 | 30 B | 2026-10-12 18:12 UTC (12d ago) |

### Crawlers / AI bots

| Name | Value | Source | Ranges | gzip | Last update |
|---|---|---|---:|---:|---|
| Google User-Triggered | `google_user_triggered` | <https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers.json> | 534 | — | 2026-10-23 05:46 UTC |
| ChatGPT-User | `chatgpt_user` | <https://openai.com/chatgpt-user.json> | 234 | 8 KiB | 2026-10-20 08:07 UTC |
| Googlebot | `googlebot` | <https://developers.google.com/static/search/apis/ipranges/googlebot.json> | 170 | — | 2026-10-23 05:45 UTC |
| Google Special Crawlers | `google_special_crawlers` | <https://developers.google.com/static/search/apis/ipranges/special-crawlers.json> | 136 | — | 2026-10-23 05:46 UTC |
| OAI-SearchBot | `oai_searchbot` | <https://openai.com/searchbot.json> | 39 | 341 B | 2026-01-02 02:00 UTC |
| Bingbot | `bingbot` | <https://www.bing.com/toolbox/bingbot.json> | 28 | — | 2024-01-03 01:00 UTC |
| Applebot | `applebot` | <https://search.developer.apple.com/applebot.json> | 24 | — | 2026-09-15 01:00 UTC |
| GPTBot | `gptbot` | <https://openai.com/gptbot.json> | 18 | 216 B | 2026-09-21 17:00 UTC |
| ClaudeBot | `claudebot` | <https://claude.com/crawling/bots.json> | 14 | — | 2026-10-20 00:00 UTC |
| PerplexityBot | `perplexitybot` | <https://www.perplexity.com/perplexitybot.json> | 8 | — | 2025-02-07 07:56 UTC |

### Anonymizers (VPN / Tor / iCloud Relay)

| Name | Value | Source | Ranges | gzip | Last update |
|---|---|---|---:|---:|---|
| NordVPN | `nordvpn_entry` | <https://api.nordvpn.com/v2/servers?limit=0> | 7,190 | — | — |
| iCloud Private Relay | `icloud_private_relay` | <https://raw.githubusercontent.com/hroost/icloud-private-relay-iplist/main/ipv4/ipv4-ranges.txt> | 3,488 | 10 KiB | 2026-10-19 05:24 UTC (5d ago) |
| Tor exit node | `tor_exit_node` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/tor_exits.ipset> | 1,226 | 5 KiB | — |
| AirVPN | `airvpn_entry` | <https://airvpn.org/api/status/> | 1,000 | — | — |
| Mullvad | `mullvad_entry` | <https://api.mullvad.net/www/relays/all/> | 566 | — | 2026-10-22 10:05 UTC |
| SOCKS proxy | `socks_proxy` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/socks_proxy.ipset> | 302 | 2 KiB | — |
| Surfshark | `surfshark_entry` | <https://api.surfshark.com/v4/server/clusters/generic> | 281 | — | — |
| IVPN | `ivpn_entry` | <https://api.ivpn.net/v4/servers/stats> | 178 | — | — |
| Privado | `privado_entry` | <https://privadovpn.com/apps/servers_export.json> | 164 | — | — |
| SSL proxy | `ssl_proxy` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/sslproxies.ipset> | 102 | 1 KiB | — |
| VyprVPN | `vyprvpn_entry` | <https://support.vyprvpn.com/hc/article_attachments/46761120489229> | 73 | — | 2026-06-18 19:23 UTC |
| TorGuard | `torguard_entry` | <https://torguard.net/downloads/OpenVPN-TCP-Linux.zip> | 52 | — | 2023-06-30 13:56 UTC |

### Non-routable

| Name | Value | Source | Ranges | gzip | Last update |
|---|---|---|---:|---:|---|
| Unallocated / bogon | `unallocated_bogon` | <https://www.team-cymru.org/Services/Bogons/fullbogons-ipv4.txt> | 3,031 | — | 2026-10-24 08:55 UTC |

<!-- sources:end -->

## Record

```json
{"146.70.163.90": [["airvpn_entry", null, null, 1792835308, null, 1792835308]]}
```

```
[tag, ref_first, ref_last, first_observed_at, first_seen_at, last_seen_at]
```

Epoch seconds, UTC. `null` means unknown. The source URL is `index.json.sources[tag]`; a link to the
exact commit is `source.replace("/main/", "/blob/" + ref_last + "/")`.

| Field | Meaning |
|---|---|
| `ref_first` / `ref_last` | commit where the address first appeared / was last seen (null if the source has no history) |
| `first_observed_at` | when **this dataset** first recorded the address |
| `first_seen_at` | earliest existence confirmed by any evidence |
| `last_seen_at` | last confirmed presence |

## Layout

```
sources.json   81 source definitions
state/         working state, one file per bucket (human readable)
shards/        241 lookup shards, keyed by the address's first octet (/8)
index.json     source URLs, shard list, empty-/8 bitmap
deltas/        per-day changes
archive/       rows dormant longer than the retention window
```

A lookup fetches exactly one shard:

```js
const shard = await fetch(`shards/${String(o1).padStart(3, "0")}.json`).then((r) => r.json());
```

## Operations

- Collected every 12 hours (00:15 / 12:15 UTC). The run timestamp is captured once and reused for
  every record.
- Rows are dropped 180 days after `last_seen_at`; commit history is squashed after 30 days.
- `npm run backfill` once, then `npm run update`.

An empty `first_seen_at` means the address disappeared before collection started. Presence in a source
list is not proof that the address answered.
