import Link from "next/link";
import { CURRENT_VERSION } from "@/lib/version";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
} from "@/components/site/docs/_primitives";

export function InstallationSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="installation" />

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
                to pick the right platform string — <InlineCode>linux-x86_64</InlineCode>,{" "}
                <InlineCode>linux-aarch64</InlineCode>,{" "}
                <InlineCode>darwin-x86_64</InlineCode> or{" "}
                <InlineCode>darwin-arm64</InlineCode>.
              </>
            ),
          },
          {
            term: "2 · resolve version",
            def: (
              <>
                Defaults to <InlineCode>latest</InlineCode>, which resolves to the version
                pinned in the script itself (currently{" "}
                <InlineCode>v{CURRENT_VERSION}</InlineCode>). Set{" "}
                <InlineCode>QUICX_VERSION</InlineCode> to pin a specific release —{" "}
                <InlineCode>{CURRENT_VERSION}</InlineCode> and{" "}
                <InlineCode>v{CURRENT_VERSION}</InlineCode> are both accepted.
              </>
            ),
          },
          {
            term: "3 · fetch",
            def: (
              <>
                Downloads the <InlineCode>quicx-&lt;platform&gt;</InlineCode> binary for that
                version straight from{" "}
                <InlineCode>Quicx-Engine/Quicx-Releases</InlineCode> on GitHub, over HTTPS,
                via <InlineCode>curl</InlineCode> (falling back to{" "}
                <InlineCode>wget</InlineCode>).
              </>
            ),
          },
          {
            term: "4 · install",
            def: (
              <>
                Marks the binary executable and moves it into{" "}
                <InlineCode>/usr/local/bin</InlineCode>, retrying with{" "}
                <InlineCode>sudo</InlineCode> if that directory isn&rsquo;t writable.
              </>
            ),
          },
          {
            term: "5 · verify",
            def: (
              <>
                Checks that <InlineCode>quicx</InlineCode> resolves on{" "}
                <InlineCode>PATH</InlineCode>. If it doesn&rsquo;t, prints the exact{" "}
                <InlineCode>export PATH=…</InlineCode> line to add instead of failing silently.
              </>
            ),
          },
        ]}
      />

      <CodeBlock
        window
        filename="pin a specific version"
        language="sh"
        code={`QUICX_VERSION=${CURRENT_VERSION} curl -fsSL https://quicx.dev/install.sh | sh`}
      />

      <SubHeading id="verify-installation">Verify it worked</SubHeading>

      <CodeBlock
        window
        filename="~ $"
        language="sh"
        code={`user@host ~ % quicx version\nquicx v${CURRENT_VERSION}\n`}
      />

      <Callout variant="tip" title="Offline / airgapped installs">
        Download the release binary directly from{" "}
        <a href="https://github.com/Quicx-Engine/Quicx-Releases">
          github.com/Quicx-Engine/Quicx-Releases
        </a>
        , copy it into your image, and drop a <InlineCode>quicx.conf</InlineCode> alongside it
        (or rely on the built-in default — see{" "}
        <Link href="/docs/configuration">Configuration</Link>). No network access is required
        at runtime — Quicx never calls home.
      </Callout>
    </section>
  );
}
