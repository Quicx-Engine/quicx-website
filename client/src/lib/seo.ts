import type { Metadata } from "next";

export const SITE_URL = "https://quicx.dev";

/** Last meaningful change to the home page (YYYY-MM-DD): its sitemap lastmod. Bump it with the change. */
export const HOME_UPDATED = "2026-11-20";

// Next merges metadata shallowly: a page that sets `openGraph` replaces the
// root layout's object wholesale. Spread this into every page-level override
// so site-wide fields are not silently dropped.
export const baseOpenGraph = {
  siteName: "Quicx",
  locale: "en_US",
} satisfies Metadata["openGraph"];
