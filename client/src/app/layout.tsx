import type { Metadata } from "next";
import { CURRENT_VERSION } from "@/lib/version";
import { SITE_URL, baseOpenGraph } from "@/lib/seo";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// One family across three widths: the wdth axis carries the condensed display
// voice, the reading text and the controls, so they share every proportion.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quicx — Deterministic Task Queue Engine",
    template: "%s | Quicx",
  },
  description:
    "Quicx is a deterministic-memory task queue daemon written in C: one fixed budget, the adaptive apool allocator, 81,900 tasks/sec at 49 µs median, 55 KB binary.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "task queue",
    "task queue engine",
    "deterministic task queue",
    "job queue",
    "message queue",
    "message broker",
    "memory-bounded task queue",
    "adaptive memory allocator",
    "binary protocol",
    "QXP protocol",
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
      "A task queue that never asks the OS for another byte. 46,593 tasks in 8 MiB, 81,900 tasks/sec at 49 µs median end to end, 55 KB binary — measured on macOS and Linux.",
    type: "website",
    url: SITE_URL,
    ...baseOpenGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: "Quicx — Deterministic Task Queue Engine",
    description:
      "A task queue with a hard memory limit: 46,593 tasks in 8 MiB, 81,900 tasks/sec at 49 µs median end to end, 55 KB binary — all measured.",
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
        "description": "Deterministic task queue engine with a fixed memory budget, the apool adaptive allocator and its own binary protocol, QXP.",
        "inLanguage": "en-US",
        "publisher": { "@id": "https://quicx.dev/#organization" },
      },
      {
        "@type": "Organization",
        "@id": "https://quicx.dev/#organization",
        "name": "Quicx",
        "url": "https://quicx.dev",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quicx.dev/apple-icon.png",
          "width": 180,
          "height": 180,
        },
        "sameAs": ["https://github.com/Quicx-Engine"],
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
          "Quicx is a deterministic-memory task queue daemon written in C, built on apool, an adaptive page allocator. You declare a memory budget at startup; the daemon never uses more, and gives back what a burst used once the queue drains. The default 8 MiB holds 46,593 tasks of 100 B. Measured at 81,900 tasks/sec end to end with a 49 µs median, in a 55 KB binary with no runtime dependencies.",
        "featureList": [
          "Fixed memory budget, mapped once and never exceeded",
          "Adaptive apool allocator — 46,593 tasks of 100 B in 8 MiB (measured)",
          "Memory returned to the OS after a burst — 2,080 KB held once drained (measured)",
          "81,900 tasks/sec end to end on one thread (measured)",
          "49 µs median submit-to-done latency (measured)",
          "55 KB binary — no runtime dependencies",
          "QXP, the Quicx Protocol — a compact binary protocol with 12 message types",
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
          "sameAs": [
            "https://github.com/anastassow",
            "https://www.linkedin.com/in/dimitar-anastasov-339a94310/",
          ],
        },
        "publisher": { "@id": "https://quicx.dev/#organization" },
        "sameAs": ["https://github.com/Quicx-Engine/Quicx-Releases"],
        "inLanguage": "en-US"
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-quicx-bg text-quicx-text">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
