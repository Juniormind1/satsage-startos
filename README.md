<p align="center">
  <img src="icon.png" alt="SatSage Logo" width="21%">
</p>

# SatSage on StartOS

> Everything not listed here behaves the same as upstream SatSage. See the
> upstream README for features and usage.

[SatSage](https://github.com/Juniormind1/SatSage) reconstructs watch-only Bitcoin
wallet history from XPUBs and descriptors. It holds no seeds or private keys.

- **Upstream repo:** <https://github.com/Juniormind1/SatSage>
- **Wrapper repo:** <https://github.com/Juniormind1/satsage-startos>

## Image and Container Runtime

| Property      | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| Image         | `ghcr.io/juniormind1/satsage` (prebuilt by upstream CI)      |
| Architectures | x86_64, aarch64                                              |
| Entrypoint    | image default (`tini` → `docker_entrypoint.sh` → `server.py`) |
| Port          | 8730 (HTTP, inside the container)                            |

The pin lives in `startos/manifest/index.ts` (`images.satsage.source.dockerTag`);
see `UPDATING.md`.

## Volume and Data Layout

One volume, `main`, mounted at `/data`. It holds the SatSage settings file
(`.env`, mode 600) and its backup, the optional password hash, the UTXO,
immutable, sanctions and label caches, and `store.json` (indexer choice).

The `bitcoind` volume is mounted read-only at `/mnt/bitcoind` to read the RPC
cookie (`RPC_COOKIE_FILE=/mnt/bitcoind/.cookie`). SatSage never writes there.

## File Models

- `store.json` on `main`: `{ indexer: 'electrs' | 'fulcrum' }`, default `electrs`.

## Dependencies

| Dependency | Required | Kind    | Health checks                 | Purpose                     |
| ---------- | -------- | ------- | ----------------------------- | --------------------------- |
| bitcoind   | yes      | running | `bitcoind`, `sync-progress`   | RPC and cookie              |
| electrs    | if chosen| running | `electrs`, `sync`             | Electrum index              |
| fulcrum    | if chosen| running | `primary`, `sync-progress`    | Electrum index              |

Exactly one indexer is enabled, decided by `store.json` (`enabled` on the
optional dependency). Bridge addresses come from `sdk.host.getBridgeAddress`;
the Electrum connection is plaintext port 50001 on the internal bridge.

## Network Access and Interfaces

One UI interface (`ui`), HTTP on 8730 with StartOS-terminated TLS and
`X-Forwarded-*` headers. No basic auth; an optional SatSage password is set by
the user inside the app. The service binds `0.0.0.0` because the StartOS proxy
dials the container bridge IP. Outbound public requests are off by default
(`SATSAGE_OUTBOUND_PUBLIC_OPT_IN=0`).

## Installation and First-Run Flow

No setup step is required. After install, pick the indexer with **Select
Indexer** if you do not use electrs, and make sure bitcoind and the indexer are
synced.

## Actions

- **Select Indexer** (`select-indexer`): choose electrs or Fulcrum. Writes
  `store.json`; dependencies and the main daemon follow the change.

## Tasks

None.

## Health Checks

- **SatSage API**: port 8730 listening, 30 s grace period.

## Backups and Restore

The whole `main` volume is backed up. Restore needs no extra step.

## Limitations and Differences

- The main daemon fails to start until the bridge addresses of bitcoind and the
  chosen indexer are available.
- No Tor- or clearnet-specific behavior; exposure is whatever the user enables
  in StartOS.

## Quick Reference for AI Consumers

- Package id `satsage`, volume `main` → `/data`, port 8730, interface `ui`.
- Action `select-indexer`; state in `store.json`.
- Managed mode flag: `SATSAGE_MANAGED_BY=start9`.
