import type { Metadata } from "next";
import { Anton, Archivo, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quicx — Deterministic Task Queue Engine",
    template: "%s | Quicx",
  },
  description:
    "Quicx is a lightweight, deterministic task queue daemon built on the PMAD slab allocator. O(1) allocation, zero fragmentation, 63 KB static binary. Configure it once. Run it forever.",
  metadataBase: new URL("https://quicx.dev"),
  keywords: [
    "task queue",
    "task queue engine",
    "deterministic task queue",
    "job queue",
    "message queue",
    "message broker",
    "PMAD allocator",
    "slab allocator",
    "binary protocol",
    "lightweight task queue",
    "open source task queue",
    "Java task queue",
    "quicx",
    "quicx daemon",
    "zero GC task queue",
    "high throughput task queue",
  ],
  authors: [{ name: "Dimitar Anastasov", url: "https://www.linkedin.com/in/dimitar-anastasov-339a94310/" }],
  creator: "Dimitar Anastasov",
  publisher: "Nefara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Quicx — Deterministic Task Queue Engine",
    description:
      "O(1) allocation, zero fragmentation, 63 KB binary. A task queue daemon built on the PMAD slab allocator — no GC pauses, no allocator jitter. Configure it once. Run it forever.",
    type: "website",
    url: "https://quicx.dev",
    siteName: "Quicx",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@quicxdev",
    creator: "@quicxdev",
    title: "Quicx — Deterministic Task Queue Engine",
    description:
      "O(1) allocation, zero fragmentation, 63 KB binary. A task queue daemon built on the PMAD slab allocator — no GC pauses, no jitter.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://quicx.dev/#website",
        "name": "Quicx",
        "url": "https://quicx.dev",
        "description": "Deterministic task queue engine with PMAD slab allocator and binary protocol.",
        "inLanguage": "en-US",
        "publisher": { "@id": "https://quicx.dev/#organization" },
      },
      {
        "@type": "Organization",
        "@id": "https://quicx.dev/#organization",
        "name": "Nefara",
        "url": "https://www.nefara.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quicx.dev/nefara-logo.svg",
        },
        "sameAs": [
          "https://github.com/anastassow",
          "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://quicx.dev/#software",
        "name": "Quicx",
        "url": "https://quicx.dev",
        "operatingSystem": "Linux, macOS",
        "applicationCategory": "DeveloperApplication",
        "applicationSubCategory": "Task Queue, Message Queue",
        "softwareVersion": "1.0.0",
        "releaseNotes": "https://quicx.dev/docs",
        "description":
          "Quicx is a lightweight, deterministic task queue daemon built on the PMAD slab allocator. It delivers O(1) allocation, zero fragmentation, and a compact binary protocol — no GC pauses, no jitter, one 63 KB static binary.",
        "featureList": [
          "O(1) deterministic allocation via PMAD slab allocator",
          "Zero fragmentation — pre-sized size classes",
          "19.1 ns allocation latency",
          "63 KB static binary — no runtime dependencies",
          "Compact binary protocol with 12 message types",
          "Java client published to Maven Central",
          "Real-time CLI observability with quicx status",
        ],
        "downloadUrl": "https://quicx.dev/install.sh",
        "installUrl": "https://quicx.dev/install.sh",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "author": {
          "@type": "Person",
          "name": "Dimitar Anastasov",
          "url": "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
        },
        "publisher": { "@id": "https://quicx.dev/#organization" },
        "sameAs": ["https://github.com/anastassow/Quicx"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-quicx-bg text-quicx-text">
        {children}
      </body>
    </html>
  );
}
