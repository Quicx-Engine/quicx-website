# quicx.dev

The website and documentation of [Quicx](https://github.com/anastassow/Quicx), a task queue for devices and servers with little memory that never goes past its memory budget and keeps the most valuable work when the budget is full.

**Live:** [quicx.dev](https://quicx.dev) · **Docs:** [quicx.dev/docs](https://quicx.dev/docs/installation) · **Installer:** `curl -fsSL https://quicx.dev/install.sh | sh`

## What is here

| | |
|---|---|
| The landing page | `client/src/app/page.tsx` and `client/src/components/site/` |
| Eleven documentation pages | one file each in `client/src/components/site/docs/sections/`: installation, quick start, configuration, architecture, allocator, QXP protocol, benchmarks, limitations, CLI reference, Java client, changelog |
| Title, description and date of every page | `client/src/components/site/docs/sections-meta.ts` |
| Every measured number on the site | `client/src/lib/benchmarks.ts`, copied from the raw results in the Quicx repository ([which script produced each one](https://github.com/anastassow/Quicx/blob/main/docs/README.md)) |
| The installer served at quicx.dev/install.sh | `client/public/install.sh`: picks the binary for the OS and CPU from [Quicx-Releases](https://github.com/Quicx-Engine/Quicx-Releases) and checks it against `SHA256SUMS` |
| Search and sharing | per-page metadata and Open Graph images, JSON-LD (`client/src/app/layout.tsx`), `sitemap.ts`, `robots.ts`, and `client/public/llms.txt` for AI search tools |

## Run it

Node 20 or later:

```sh
cd client
npm install
npm run dev      # http://localhost:3000
npm run build    # the production build, which also checks every page renders
npm run lint
```

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. Every page is rendered statically at build time.

## Changing the site

- A number belongs in `client/src/lib/benchmarks.ts` only if a script in the Quicx repository measured it; the source is noted next to it.
- A new docs page needs a section file in `sections/`, its entry in `sections.ts`, an entry in `sections-meta.ts` (title, description and the `updated` date the sitemap uses) and its headings in `DocsSearch.tsx`.
- After a Quicx release, update `client/src/lib/version.ts`, `LATEST_VERSION` in `client/public/install.sh` (only once the binaries are in Quicx-Releases) and the changelog page.

## Deploying

The site is hosted on Vercel. `main` is production at quicx.dev; every other branch gets a preview deployment. `www.quicx.dev` redirects to `quicx.dev`.

## Related

- [anastassow/Quicx](https://github.com/anastassow/Quicx): the daemon, its tests, the technical report and the research
- [Quicx-Engine/Quicx-Java](https://github.com/Quicx-Engine/Quicx-Java): the Java client
- [Quicx-Engine/Quicx-Releases](https://github.com/Quicx-Engine/Quicx-Releases): release binaries with checksums

## Licence

MIT, see [LICENSE](LICENSE).
