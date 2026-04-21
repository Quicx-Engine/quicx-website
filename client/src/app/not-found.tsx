import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Interactive404 } from "@/components/site/Interactive404";

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
