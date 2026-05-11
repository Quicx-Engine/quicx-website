import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { FeatureCards } from "@/components/site/FeatureCards";
import { Architecture } from "@/components/site/Architecture";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { Footer } from "@/components/site/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quicx — Deterministic Task Queue Engine",
  description:
    "Quicx is a lightweight task queue daemon built on the PMAD slab allocator. O(1) allocation, zero fragmentation, 63 KB static binary. Configure it once. Run it forever.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quicx — Deterministic Task Queue Engine",
    description:
      "O(1) allocation, zero fragmentation, 63 KB binary. A task queue daemon built on PMAD — no GC pauses, no jitter. Configure it once. Run it forever.",
    url: "https://quicx.dev",
    type: "website",
  },
  twitter: {
    title: "Quicx — Deterministic Task Queue Engine",
    description:
      "O(1) allocation, zero fragmentation, 63 KB binary. A task queue daemon built on PMAD — no GC pauses, no jitter.",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <LogoMarquee />
        <FeatureCards />
        <Architecture />
      </main>
      <Footer />
    </>
  );
}
