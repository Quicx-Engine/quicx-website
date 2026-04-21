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
  title: "Quicx — A task queue engine that adapts for you",
  description:
    "Quicx is a lightweight, deterministic task queue engine with a custom PMAD slab allocator and a fast binary protocol. Configure it once. Run it forever.",
  metadataBase: new URL("https://quicx.dev"),
  keywords: ["task queue", "message broker", "job queue", "slab allocator", "binary protocol", "event loop", "quicx"],
  authors: [{ name: "Dimitar Anastasov" }],
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
    title: "Quicx — A task queue engine that adapts for you",
    description:
      "Configure it once. Run it forever. Watch it breathe. Lightweight by design. No surprises.",
    type: "website",
    url: "https://quicx.dev",
    siteName: "Quicx",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quicx — A task queue engine that adapts for you",
    description: "Lightweight, deterministic task queue engine with a custom PMAD slab allocator and a fast binary protocol.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Quicx",
    "operatingSystem": "Linux, macOS",
    "applicationCategory": "DeveloperApplication",
    "description": "Quicx is a lightweight, deterministic task queue engine with a custom PMAD slab allocator and a fast binary protocol.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Dimitar Anastasov",
      "url": "https://www.linkedin.com/in/dimitar-anastasov-339a94310/"
    }
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
