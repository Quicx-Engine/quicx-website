import { Container, TextLink } from "./primitives";
import { InstallCommand } from "./InstallCommand";
import { PoolInstrument } from "./PoolInstrument";

export function Hero() {
  return (
    <section className="border-b border-quicx-line">
      <Container className="pb-16 pt-[clamp(2.5rem,7vh,5.5rem)] lg:pb-24">
        <h1 className="display text-[clamp(2.9rem,min(10.4vw,15.5vh),8.75rem)] text-quicx-text">
          <span className="line-mask">
            <span>Never asks the OS</span>
          </span>
          <span className="line-mask">
            <span style={{ "--d": "90ms" } as React.CSSProperties}>for another byte.</span>
          </span>
        </h1>

        <div className="mt-9 grid grid-cols-1 gap-x-10 gap-y-12 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.22fr)]">
          <div className="flex flex-col lg:pt-1">
            <p
              className="enter max-w-[38ch] text-[18px] leading-[1.6] text-quicx-body sm:text-[19px]"
              style={{ "--d": "380ms" } as React.CSSProperties}
            >
              A deterministic-memory task queue, written in C. You give it a memory budget at
              startup. It never uses more, tells you precisely what it is using, and gives back
              what a burst needed once the queue drains.
            </p>

            <div className="enter mt-9" style={{ "--d": "480ms" } as React.CSSProperties}>
              <InstallCommand emphasis />
              <p className="mt-2.5 text-[13px] text-quicx-dim">
                Linux and macOS, x86-64 and arm64. Installs the{" "}
                <code className="font-mono text-quicx-muted">quicx</code> binary to{" "}
                <code className="font-mono text-quicx-muted">/usr/local/bin</code>.
              </p>
            </div>

            <div
              className="enter mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
              style={{ "--d": "580ms" } as React.CSSProperties}
            >
              <TextLink href="/docs/quick-start">Start with Quicx</TextLink>
              <TextLink href="/docs/installation" className="text-quicx-body">
                Read the docs
              </TextLink>
            </div>
          </div>

          <div>
            <PoolInstrument />
          </div>
        </div>
      </Container>
    </section>
  );
}
