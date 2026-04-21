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
  openGraph: {
    title: "Quicx — A task queue engine that adapts for you",
    description:
      "Configure it once. Run it forever. Watch it breathe. Lightweight by design. No surprises.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-quicx-bg text-quicx-text">
        {children}
      </body>
    </html>
  );
}
