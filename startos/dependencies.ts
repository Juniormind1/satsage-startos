import { sdk } from './sdk'
import { selectedIndexer } from './utils'

/**
 * bitcoind is always required. Exactly one Electrum indexer (electrs XOR
 * fulcrum) is enabled, chosen via store.json / the Select Indexer action.
 * Pattern mirrors mempool-startos.
 */
const bitcoind = sdk.Dependency.required('bitcoind', {
  description: {
    en_US: 'Bitcoin Core RPC and read-only cookie for wallet lookups',
    de_DE: 'Bitcoin-Core-RPC und schreibgeschütztes Cookie für Wallet-Abfragen',
  },
  metadata: {
    title: 'Bitcoin',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/refs/heads/30.x/dep-icon.svg',
  },
  versionRange: '>=28.0:0',
  kind: 'running',
  healthChecks: ['bitcoind', 'sync-progress'],
})

const electrs = sdk.Dependency.optional('electrs', {
  description: {
    en_US:
      'Electrum index (electrs). Use Select Indexer to choose electrs or Fulcrum.',
    de_DE:
      'Electrum-Index (electrs). Mit „Select Indexer“ zwischen electrs und Fulcrum wählen.',
  },
  metadata: {
    title: 'Electrs',
    icon: 'https://raw.githubusercontent.com/Start9Labs/electrs-startos/refs/heads/master/icon.svg',
  },
  versionRange: '>=0.11.1:14',
  kind: 'running',
  healthChecks: ['electrs', 'sync'],
  enabled: async ({ effects }) =>
    (await selectedIndexer(effects)) === 'electrs',
})

const fulcrum = sdk.Dependency.optional('fulcrum', {
  description: {
    en_US:
      'Electrum index (Fulcrum). Use Select Indexer to choose Fulcrum or electrs.',
    de_DE:
      'Electrum-Index (Fulcrum). Mit „Select Indexer“ zwischen Fulcrum und electrs wählen.',
  },
  metadata: {
    title: 'Fulcrum',
    icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/master/icon.png',
  },
  versionRange: '>=2.1.1:0',
  kind: 'running',
  healthChecks: ['primary', 'sync-progress'],
  enabled: async ({ effects }) =>
    (await selectedIndexer(effects)) === 'fulcrum',
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(bitcoind)
  .addDependency(electrs)
  .addDependency(fulcrum)
