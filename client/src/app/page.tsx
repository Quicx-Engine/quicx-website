import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MeasuredResults } from "@/components/site/MeasuredResults";
import { FeatureCards } from "@/components/site/FeatureCards";
import { Architecture } from "@/components/site/Architecture";
import { HonestLimits } from "@/components/site/HonestLimits";
import { CTABanner } from "@/components/site/CTABanner";
import { Footer } from "@/components/site/Footer";
import type { Metadata } from "next";
import { SITE_URL, baseOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Quicx - Deterministic Task Queue Engine",
  description:
    "Quicx is a task queue daemon with a hard memory limit: 46,593 tasks in 8 MiB, 81,900 tasks/sec at 49 µs median, a 55 KB binary, no dependencies. All measured.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Quicx - Deterministic Task Queue Engine",
    description:
      "A task queue that never asks the OS for another byte. 46,593 tasks in 8 MiB, 81,900 tasks/sec at 49 µs median end to end, 55 KB binary — measured on macOS and Linux.",
    url: SITE_URL,
    type: "website",
    ...baseOpenGraph,
  },
  twitter: {
    card: "summary_large_image",
    title: "Quicx - Deterministic Task Queue Engine",
    description:
      "A task queue with a hard memory limit: 46,593 tasks in 8 MiB, 81,900 tasks/sec at 49 µs median end to end, 55 KB binary — all measured.",
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
