# Updating the upstream version

Upstream is [Juniormind1/SatSage](https://github.com/Juniormind1/SatSage). Its CI
(`build-docker-image.yml`) builds and pushes the multi-arch image
`ghcr.io/juniormind1/satsage:<version>` (linux/amd64 + linux/arm64) on every
release tag `v<version>`.

## Determining the upstream version

```sh
gh release view -R Juniormind1/SatSage --json tagName -q .tagName
```

Confirm the image tag exists and is multi-arch before pinning:

```sh
docker buildx imagetools inspect ghcr.io/juniormind1/satsage:<version>
```

The current pin is `images.satsage.source.dockerTag` in
`startos/manifest/index.ts` (the part after `:`, without the leading `v`).

## Applying the bump

- Set `dockerTag` to `ghcr.io/juniormind1/satsage:<new version>`.
- Set `version` in `startos/versions/current.ts` to `'<new version>:0'` and
  write the release notes (en_US and de_DE at least).
- If the new SatSage needs a data migration, follow the Versions guide.
