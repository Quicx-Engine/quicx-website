import { Container, ButtonLink, ArrowGlyph } from "./primitives";
import { InstallCommand } from "./InstallCommand";
import { Reveal } from "./motion";

/** The close: the page's one full field of Quicx orange. */
export function CTABanner() {
  return (
    <section aria-labelledby="get-started-title" className="bg-quicx-orange text-quicx-on-orange">
      <Container className="py-20 lg:py-28">
        <Reveal threshold={0.4}>
          <h2 id="get-started-title" className="display text-[clamp(3.25rem,10vw,9rem)]">
            <span className="line-mask rise-on-reveal">
              <span>One command away.</span>
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-quicx-on-orange/25 pt-10 lg:grid-cols-12">
          <p className="max-w-[44ch] text-[17px] leading-[1.6] text-quicx-on-orange/85 lg:col-span-5">
            Install the daemon, pull the Java client from Maven Central, and submit your first
            task. No managed service, no account, no surprises.
          </p>
          <div className="flex flex-col gap-4 lg:col-span-7">
            <InstallCommand tone="onOrange" />
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/docs/installation" variant="ink">
                Install Quicx
                <ArrowGlyph />
              </ButtonLink>
              <ButtonLink href="/docs/quick-start" variant="inkOutline">
                Quick start
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
