import Link from "next/link";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeader,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
} from "@/components/site/docs/_primitives";

export function InstallationSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 01.01"
        kicker="Getting Started"
        title="Installation"
        id="installation"
        lede="Quicx ships as a single static binary. One curl command detects your OS and architecture, verifies the checksum, and drops the daemon into your PATH."
      />

      <Prose>
        <p>
          The installer is a small POSIX <InlineCode>sh</InlineCode> script — it works on{" "}
          <strong>Linux (x86_64 / arm64)</strong> and{" "}
          <strong>macOS (Intel / Apple Silicon)</strong> without any additional tooling. No
          runtime dependencies, no package manager, no JDK. The Java client is distributed
          separately through Maven Central (see{" "}
          <Link href="/docs/quick-start">Quick Start</Link>).
        </p>
      </Prose>

      <CodeBlock
        window
        filename="install with curl"
        language="sh"
        code={`curl -fsSL https://quicx.dev/install.sh | sh`}
      />

      <Prose>
        <p>
          Prefer to inspect the script first? Download it, read it, then run it — everything
          the installer does is visible plaintext:
        </p>
      </Prose>

      <CodeBlock
        window
        filename="inspect first, install later"
        language="sh"
        code={`curl -fsSL https://quicx.dev/install.sh -o install-quicx.sh
less install-quicx.sh
sh install-quicx.sh`}
      />

      <SubHeading id="what-installer-does">What the installer does</SubHeading>

      <KeyList
        items={[
          {
            term: "1 · detect",
            def: (
              <>
                Reads <InlineCode>uname -s</InlineCode> and <InlineCode>uname -m</InlineCode>{" "}
                to pick the right artifact — <InlineCode>linux-x86_64</InlineCode>,{" "}
                <InlineCode>linux-arm64</InlineCode>,{" "}
                <InlineCode>darwin-x86_64</InlineCode> or{" "}
                <InlineCode>darwin-arm64</InlineCode>.
              </>
            ),
          },
          {
            term: "2 · fetch",
            def: (
              <>
                Downloads the signed release tarball from{" "}
                <InlineCode>releases.quicx.dev</InlineCode> over HTTPS.
              </>
            ),
          },
          {
            term: "3 · verify",
            def: (
              <>
                Checks the SHA‑256 against the signed <InlineCode>SHA256SUMS</InlineCode>{" "}
                file. Exits non-zero if the hash does not match.
              </>
            ),
          },
          {
            term: "4 · install",
            def: (
              <>
                Places the <InlineCode>quicx</InlineCode> binary in{" "}
                <InlineCode>/usr/local/bin</InlineCode> (or{" "}
                <InlineCode>~/.local/bin</InlineCode> if the user does not have root). Writes
                a default <InlineCode>quicx.conf</InlineCode> to{" "}
                <InlineCode>~/.config/quicx/</InlineCode>.
              </>
            ),
          },
          {
            term: "5 · verify",
            def: (
              <>
                Runs <InlineCode>quicx version</InlineCode> and prints the resolved install
                path so you know the <InlineCode>PATH</InlineCode> lookup works.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="verify-installation">Verify it worked</SubHeading>

      <CodeBlock
        window
        filename="~ $"
        language="sh"
        code={`user@host ~ % quicx version
quicx v1.0.1
`}
      />

      <Callout variant="tip" title="Offline / airgapped installs">
        Download the release archive directly from{" "}
        <a href="https://github.com/anastassow/Quicx/tree/main/releases">
          github.com/anastassow/Quicx/tree/main/releases
        </a>
        , copy the binary into your image, and drop the{" "}
        <InlineCode>quicx.conf</InlineCode> alongside it. No network access is required at
        runtime — Quicx never calls home.
      </Callout>
    </section>
  );
}
