# IP Observation History

The time dimension for IP classification. For every address it keeps the first and last moment a
source listed it, plus the upstream commit that said so. This is data, not a plugin.

## Data sources

The same sources the [IP Classification](https://github.com/Vineyard-Intelligence/pluginpack-ip-classification)
pack uses. Sources hosted on GitHub can be replayed through their commit history; the rest publish
current state only.

<!-- sources:start -->
Sources whose content changes often are fetched on every run; the rest ship inside the
bundled snapshot.

### Scanners

| Name | Value | Source |
|---|---|---|
| Stretchoid | `stretchoid` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/strechoid_v4.txt> |
| Hunter | `hunter` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/hunter_v4.txt> |
| BinaryEdge | `binaryedge` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/binaryedge_v4.txt> |
| Quake | `quake` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/quake_v4.txt> |
| FOFA | `fofa` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/fofa_v4.txt> |
| Mandiant | `mandiant` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/mandiantasm_v4.txt> |
| LeakIX | `leakix` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/leakix_v4.txt> |
| Tenable | `tenable` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/tenableasm_v4.txt> |
| Shodan | `shodan` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/shodan_v4.txt> |
| VirusTotal | `virustotal` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/virustotal_v4.txt> |
| Netlas | `netlas` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/netlas_v4.txt> |
| Group-IB | `group_ib` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/groupib_v4.txt> |
| Censys | `censys` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/censys_v4.txt> |
| ZoomEye | `zoomeye` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/zoomeye_v4.txt> |
| ONYPHE | `onyphe` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/onyphe_v4.txt> |
| Shadowserver | `shadowserver` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/shadowserver_v4.txt> |
| Rapid7 | `rapid7` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/rapid7_v4.txt> |
| Palo Alto Expanse | `palo_alto_expanse` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/paloaltonetworks_v4.txt> |
| Recorded Future | `recorded_future` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/recordedfuture_v4.txt> |
| Bitsight | `bitsight` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/bitsight_v4.txt> |
| Intrinsec | `intrinsec` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/intrinsec_v4.txt> |
| Criminal IP | `criminal_ip` | <https://raw.githubusercontent.com/OpenFilters/internet-scanners/main/cidr/criminalip_v4.txt> |

### C2 / malware

| Name | Value | Source |
|---|---|---|
| GoPhish | `gophish` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/GoPhish%20IPs.txt> |
| Sliver | `sliver` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Sliver%20C2%20IPs.txt> |
| Metasploit | `metasploit` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Metasploit%20Framework%20C2%20IPs.txt> |
| Viper | `viper` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Viper%20C2%20IPs.txt> |
| Cobalt Strike | `cobalt_strike` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Cobalt%20Strike%20C2%20IPs.txt> |
| PANDA | `panda` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/PANDA%20C2%20IPs.txt> |
| Hak5 Cloud C2 | `hak5_cloud_c2` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Hak5%20Cloud%20C2%20IPs.txt> |
| BurpSuite | `burpsuite` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/BurpSuite%20IPs.txt> |
| Mythic | `mythic` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Mythic%20C2%20IPs.txt> |
| XMRig | `xmrig` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/XMRig%20Monero%20Cryptominer%20IPs.txt> |
| Havoc | `havoc` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Havoc%20C2%20IPs.txt> |
| Sectop | `sectop` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Sectop%20RAT%20IPs.txt> |
| Supershell | `supershell` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Supershell%20C2%20IPs.txt> |
| ShadowPad | `shadowpad` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/ShadowPad%20IPs.txt> |
| RedGuard | `redguard` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/RedGuard%20C2%20IPs.txt> |
| AsyncRAT | `asyncrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/AsyncRAT%20IPs.txt> |
| XtremeRAT | `xtremerat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/XtremeRAT%20Trojan%20IPs.txt> |
| Unam Web Panel | `unam_web_panel` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Unam%20Web%20Panel%20IPs.txt> |
| Gh0st | `gh0st` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Gh0st%20RAT%20Trojan%20IPs.txt> |
| DarkComet | `darkcomet` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/DarkComet%20Trojan%20IPs.txt> |
| Brute Ratel C4 | `brute_ratel_c4` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Brute%20Ratel%20C4%20IPs.txt> |
| NanoCore | `nanocore` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NanoCore%20RAT%20Trojan%20IPs.txt> |
| njRAT | `njrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/njRAT%20Trojan%20IPs.txt> |
| Posh | `posh` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Posh%20C2%20IPs.txt> |
| Covenant | `covenant` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Covenant%20C2%20IPs.txt> |
| DcRAT | `dcrat` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/DcRAT%20IPs.txt> |
| NimPlant | `nimplant` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NimPlant%20C2%20IPs.txt> |
| Quasar | `quasar` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Quasar%20RAT%20IPs.txt> |
| Remcos | `remcos` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Remcos%20RAT%20IPs.txt> |
| Caldera | `caldera` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Caldera%20C2%20IPs.txt> |
| Hookbot | `hookbot` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Hookbot%20IPs.txt> |
| NetBus | `netbus` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/NetBus%20Trojan%20IPs.txt> |
| Deimos | `deimos` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Deimos%20C2%20IPs.txt> |
| Empire | `empire` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Empire%20C2%20IPs.txt> |
| MobSF | `mobsf` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/MobSF%20IPs.txt> |
| Villain | `villain` | <https://raw.githubusercontent.com/HL-SOC/C2-Tracker/main/data/Villain%20C2%20IPs.txt> |

### Crawlers / AI bots

| Name | Value | Source |
|---|---|---|
| Google User-Triggered | `google_user_triggered` | <https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers.json> |
| ChatGPT-User | `chatgpt_user` | <https://openai.com/chatgpt-user.json> |
| Googlebot | `googlebot` | <https://developers.google.com/static/search/apis/ipranges/googlebot.json> |
| Google Special Crawlers | `google_special_crawlers` | <https://developers.google.com/static/search/apis/ipranges/special-crawlers.json> |
| OAI-SearchBot | `oai_searchbot` | <https://openai.com/searchbot.json> |
| Bingbot | `bingbot` | <https://www.bing.com/toolbox/bingbot.json> |
| Applebot | `applebot` | <https://search.developer.apple.com/applebot.json> |
| GPTBot | `gptbot` | <https://openai.com/gptbot.json> |
| ClaudeBot | `claudebot` | <https://claude.com/crawling/bots.json> |
| PerplexityBot | `perplexitybot` | <https://www.perplexity.com/perplexitybot.json> |

### Anonymizers (VPN / Tor / iCloud Relay)

| Name | Value | Source |
|---|---|---|
| NordVPN | `nordvpn_entry` | <https://api.nordvpn.com/v2/servers?limit=0> |
| iCloud Private Relay | `icloud_private_relay` | <https://raw.githubusercontent.com/hroost/icloud-private-relay-iplist/main/ipv4/ipv4-ranges.txt> |
| Tor exit node | `tor_exit_node` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/tor_exits.ipset> |
| AirVPN | `airvpn_entry` | <https://airvpn.org/api/status/> |
| Mullvad | `mullvad_entry` | <https://api.mullvad.net/www/relays/all/> |
| SOCKS proxy | `socks_proxy` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/socks_proxy.ipset> |
| Surfshark | `surfshark_entry` | <https://api.surfshark.com/v4/server/clusters/generic> |
| IVPN | `ivpn_entry` | <https://api.ivpn.net/v4/servers/stats> |
| Privado | `privado_entry` | <https://privadovpn.com/apps/servers_export.json> |
| SSL proxy | `ssl_proxy` | <https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/sslproxies.ipset> |
| VyprVPN | `vyprvpn_entry` | <https://support.vyprvpn.com/hc/article_attachments/46761120489229> |
| TorGuard | `torguard_entry` | <https://torguard.net/downloads/OpenVPN-TCP-Linux.zip> |

### Non-routable

| Name | Value | Source |
|---|---|---|
| Unallocated / bogon | `unallocated_bogon` | <https://www.team-cymru.org/Services/Bogons/fullbogons-ipv4.txt> |

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
sources.json   source definitions
state/         working state, one file per bucket (human readable)
shards/        lookup shards, keyed by the address's first octet (/8)
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
