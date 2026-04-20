import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { FeatureCards } from "@/components/site/FeatureCards";
import { Architecture } from "@/components/site/Architecture";
import { LogoMarquee } from "@/components/site/LogoMarquee";
import { Footer } from "@/components/site/Footer";

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
