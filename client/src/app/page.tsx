import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MeasuredResults } from "@/components/site/MeasuredResults";
import { FeatureCards } from "@/components/site/FeatureCards";
import { Architecture } from "@/components/site/Architecture";
import { HonestLimits } from "@/components/site/HonestLimits";
import { CTABanner } from "@/components/site/CTABanner";
import { Footer } from "@/components/site/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quicx - Deterministic Task Queue Engine",
  description:
    "Quicx is a task queue daemon with a fixed memory pool: 74,300 tasks/sec end to end at 51 µs median, zero memory growth, 54 KB binary, no dependencies. Every figure measured with bench/run.sh.",
  alternates: {
    canonical: "https://quicx.dev",
  },
  openGraph: {
    title: "Quicx - Deterministic Task Queue Engine",
    description:
      "Fixed memory pool, exact accounting, no allocator surprises. 74,300 tasks/sec at 51 µs median end-to-end latency, 54 KB binary, zero dependencies — all measured, all reproducible.",
    url: "https://quicx.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quicx - Deterministic Task Queue Engine",
    description:
      "Fixed memory pool, exact accounting, no allocator surprises. 74,300 tasks/sec at 51 µs median end-to-end, 54 KB binary, zero dependencies.",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <MeasuredResults />
        <FeatureCards />
        <Architecture />
        <HonestLimits />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
