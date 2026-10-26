import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'satsage',
  title: 'SatSage',
  license: 'MIT',
  packageRepo: 'https://github.com/Juniormind1/satsage-startos',
  upstreamRepo: 'https://github.com/Juniormind1/SatSage',
  marketingUrl: 'https://github.com/Juniormind1/SatSage',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    satsage: {
      // Prebuilt multi-arch image from SatSage's own CI (build-docker-image.yml).
      // Pin and bump procedure: UPDATING.md
      source: { dockerTag: 'ghcr.io/juniormind1/satsage:1.0.1' },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
