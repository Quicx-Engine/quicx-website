import type { Metadata } from "next";
import { CURRENT_VERSION } from "@/lib/version";
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
    "Quicx is a deterministic-memory task queue daemon written in C. Fixed PMAD pool, exact accounting, no allocator surprises — 74,300 tasks/sec at 51 µs median end-to-end, 54 KB binary, zero dependencies.",
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
  publisher: "Quicx",
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
      "A task queue that never asks the OS for another byte. 74,300 tasks/sec end to end at 51 µs median, 0 KB memory growth, 54 KB binary — every figure measured with bench/run.sh.",
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
      "A task queue that never asks the OS for another byte. 74,300 tasks/sec at 51 µs median end-to-end, 0 KB memory growth, 54 KB binary — all measured.",
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
        "name": "Quicx",
        "url": "https://quicx.org",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quicx.dev/quicx-logo.svg",
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
        "softwareVersion": CURRENT_VERSION,
        "releaseNotes": "https://quicx.dev/docs/changelog",
        "description":
          "Quicx is a deterministic-memory task queue daemon written in C, built on the PMAD slab allocator. You declare a memory budget at startup; the daemon uses exactly that and never grows. Measured at 74,300 tasks/sec end to end with a 51 µs median, in a 54 KB binary with no runtime dependencies.",
        "featureList": [
          "Fixed memory pool — 0 KB RSS growth measured over 443,912 tasks",
          "O(1) deterministic allocation via PMAD slab allocator",
          "Zero fragmentation — pre-sized size classes",
          "74,300 tasks/sec end to end on one thread (measured)",
          "51 µs median submit-to-done latency (measured)",
          "54 KB binary — no runtime dependencies",
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
        "inLanguage": "en-US"
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
