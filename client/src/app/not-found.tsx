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
      <main className="flex-1 border-b border-quicx-line">
        <Interactive404 />
      </main>
      <Footer />
    </>
  );
}
