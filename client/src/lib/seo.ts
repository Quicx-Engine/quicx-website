import type { Metadata } from "next";

export const SITE_URL = "https://quicx.dev";

// Next merges metadata shallowly: a page that sets `openGraph` or `twitter`
// replaces the root layout's object wholesale. Spread these into every
// page-level override so site-wide fields are not silently dropped.
export const baseOpenGraph = {
  siteName: "Quicx",
  locale: "en_US",
} satisfies Metadata["openGraph"];

export const baseTwitter = {
  site: "@quicxdev",
  creator: "@quicxdev",
} satisfies Metadata["twitter"];
