import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Interactive404 } from "@/components/site/Interactive404";
import type { Metadata } from "next";

// Next adds <meta name="robots" content="noindex"> to every 404 by itself.
// null drops the root layout's "index, follow" (and its googlebot tag), so
// that automatic tag is the only robots tag on the page.
export const metadata: Metadata = {
  title: "Page not found",
  robots: null,
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
