import { features } from "./featuresData";
import { Container, SectionHead } from "./primitives";
import { PrinciplesIndex } from "./PrinciplesIndex";

export function FeatureCards() {
  return (
    <section id="features" aria-labelledby="features-title" className="border-b border-quicx-line">
      <Container className="py-24 lg:py-32">
        <SectionHead
          id="features-title"
          title="Six design decisions."
          continuation="Each with its evidence."
        >
          <p>
            Pick one to see it working.
          </p>
        </SectionHead>

        <PrinciplesIndex features={features} />
      </Container>
    </section>
  );
}
