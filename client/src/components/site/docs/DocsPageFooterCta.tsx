import { ButtonLink, ArrowGlyph } from "@/components/site/primitives";

export function DocsPageFooterCta() {
  return (
    <div className="rounded-[3px] bg-quicx-orange px-6 py-8 text-quicx-on-orange sm:px-10 sm:py-10">
      <h3 className="display text-[clamp(2rem,4vw,2.75rem)]">Configure it once. Run it forever.</h3>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.6] text-quicx-on-orange/85">
        One binary, one .conf file, a Java jar on Maven Central. The rest is just taking tasks off a
        queue.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <ButtonLink href="/docs/installation" variant="ink">
          Install Quicx
          <ArrowGlyph />
        </ButtonLink>
        <ButtonLink
          href="https://github.com/Quicx-Engine/Quicx-Releases"
          variant="inkOutline"
          external
        >
          Releases on GitHub
        </ButtonLink>
      </div>
    </div>
  );
}
