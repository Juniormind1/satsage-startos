# AGENTS.md

StartOS service package for SatSage. Packaging guide: <https://docs.start9.com/packaging>.
`README.md` is the technical reference, `instructions.md` the user guide.

- **Do not copy SatSage source into this repo.** The app comes only from the
  pinned `ghcr.io/juniormind1/satsage` image (see `UPDATING.md`).
- **Electrum env vars are named `FULCRUM_*` for both indexers** — that is the app's
  naming, not a bug; `SATSAGE_ELECTRUM_INDEXER` tells it which package it is.
- **Keep the bitcoind mount read-only**; SDK 3 enforces it and SatSage only reads the cookie.
