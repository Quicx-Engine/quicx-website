import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Interactive404 } from "@/components/site/Interactive404";
import type { Metadata } from "next";

// Overrides the root layout's "index, follow" so the 404 page doesn't ship
// two contradictory robots tags alongside Next's automatic noindex.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
        <Interactive404 />
      </main>
      <Footer />
    </>
  );
}
