import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared by every opengraph-image route. Fonts and the logo are read from the
// repository at build time, so the images render the same on every build and
// never depend on a network request (the old version fetched Google Fonts and
// failed the build whenever that request did).

export const OG_SIZE = { width: 1200, height: 630 };

// Tokens from DESIGN.md.
export const OG = {
  ground: "#0a171d",
  well: "#061015",
  hairline: "rgba(190, 222, 236, 0.085)",
  hairlineStrong: "rgba(190, 222, 236, 0.16)",
  text: "#edf2f5",
  body: "#c3ced5",
  muted: "#a1b0b9",
  dim: "#7f909a",
  orange: "#ff5700",
  orangeBright: "#ff7a33",
} as const;

// Satori cannot set the wdth axis, so the condensed display voice comes from
// Google's static extra-condensed 900 instance of Archivo (closest to the
// site's wdth 62 / 860). It is registered as "Archivo" at weight 900, so
// fontWeight 900 selects it. Licences sit next to the files (SIL OFL 1.1).
const fontDir = join(process.cwd(), "assets/og-fonts");

export async function loadOgFonts() {
  const [display, regular, medium, mono] = await Promise.all([
    readFile(join(fontDir, "Archivo-ExtraCondensed-Black.ttf")),
    readFile(join(fontDir, "Archivo-Regular.ttf")),
    readFile(join(fontDir, "Archivo-Medium.ttf")),
    readFile(join(fontDir, "JetBrainsMono-Medium.ttf")),
  ]);
  return [
    { name: "Archivo", data: display, weight: 900 as const, style: "normal" as const },
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

export async function loadOgLogo() {
  const svg = await readFile(join(process.cwd(), "public/quicx-logo.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

// The logo's viewBox is 2966 x 1283.
export const LOGO_RATIO = 2966 / 1283;
