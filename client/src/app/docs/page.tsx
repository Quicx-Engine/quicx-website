import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Terminal as TerminalIcon } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArchitectureDiagram } from "@/components/site/Architecture";
import {
  DocsSidebar,
  type DocsNavGroup,
} from "@/components/site/docs/DocsSidebar";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import { Tabs } from "@/components/site/docs/Tabs";

/* ─────────────── Sidebar model ─────────────── */

const nav: DocsNavGroup[] = [
  {
    label: "Getting Started",
    items: [
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
      { id: "configuration", label: "Configuration" },
    ],
  },
  {
    label: "Core Concepts",
    items: [
      { id: "architecture", label: "Architecture" },
      { id: "pmad-allocator", label: "PMAD Allocator" },
      { id: "binary-protocol", label: "Binary Protocol" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "cli-reference", label: "CLI Reference" },
      { id: "java-client", label: "Java Client" },
      { id: "changelog", label: "Changelog" },
    ],
  },
];

/* ─────────────── Page ─────────────── */

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        {/* subtle page glow + dot grid (matches landing section marker) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,87,0,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-16 lg:px-10">

          <div className="mt-14 flex gap-12">
            <DocsSidebar groups={nav} />

            <article className="min-w-0 flex-1 space-y-24">
              <InstallationSection />
              <QuickStartSection />
              <ConfigurationSection />
              <ArchitectureSection />
              <PmadSection />
              <BinaryProtocolSection />
              <CliReferenceSection />
              <JavaClientSection />
              <ChangelogSection />
              <DocsPageFooterCta />
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ─────────────── Shared UI ─────────────── */



function SectionHeader({
  num,
  kicker,
  title,
  id,
  lede,
}: {
  num: string;
  kicker: string;
  title: string;
  id: string;
  lede?: string;
}) {
  return (
    <header className="scroll-mt-24 border-b border-quicx-line pb-6" id={id}>
      <div className="flex items-center gap-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.3em]">
        <span className="text-quicx-dim">{num}</span>
        <span className="h-px w-8 bg-gradient-to-r from-quicx-orange/70 to-transparent" />
        <span className="text-quicx-orange-bright">{kicker}</span>
      </div>
      <h2 className="mt-3 font-[family-name:var(--font-archivo)] text-[clamp(1.75rem,3.6vw,2.4rem)] font-semibold leading-[1.1] text-quicx-text">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-quicx-muted">
          {lede}
        </p>
      )}
    </header>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-[14.5px] leading-relaxed text-quicx-muted [&_strong]:font-semibold [&_strong]:text-quicx-text [&_a]:text-quicx-orange-bright [&_a]:underline [&_a]:decoration-quicx-orange/40 [&_a]:underline-offset-4 [&_a:hover]:decoration-quicx-orange">
      {children}
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-quicx-text">
      {children}
    </code>
  );
}

function SubHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className="scroll-mt-24 font-[family-name:var(--font-archivo)] text-[20px] font-semibold text-quicx-text"
    >
      {children}
    </h3>
  );
}

function KeyList({
  items,
}: {
  items: { term: string; def: React.ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-quicx-line overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
      {items.map((it) => (
        <div
          key={it.term}
          className="grid grid-cols-1 gap-2 px-4 py-3.5 md:grid-cols-[200px_1fr] md:gap-6"
        >
          <dt className="font-[family-name:var(--font-jetbrains-mono)] text-[12.5px] text-quicx-orange-bright">
            {it.term}
          </dt>
          <dd className="text-[13.5px] leading-relaxed text-quicx-muted">
            {it.def}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Table({
  headers,
  rows,
  highlight,
}: {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  /** which column index to accent (0-based) */
  highlight?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-quicx-line bg-white/[0.02]">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 font-[family-name:var(--font-barlow-condensed)] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-quicx-dim"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-quicx-line/70 last:border-b-0"
              >
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={
                      j === highlight
                        ? "px-4 py-3 text-quicx-orange-bright"
                        : "px-4 py-3 text-quicx-muted"
                    }
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FrameDiagram() {
  const fields: { label: string; sub: string; color: string; flex: string }[] = [
    { label: "version", sub: "1 byte", color: "#60a5fa", flex: "0 0 80px" },
    { label: "type", sub: "1 byte", color: "#FF7A33", flex: "0 0 80px" },
    { label: "length", sub: "4 bytes", color: "#5eead4", flex: "0 0 140px" },
    { label: "payload", sub: "length bytes", color: "#a78bfa", flex: "1 1 0%" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-quicx-line bg-[#0a1a22]">
      {/* Cells */}
      <div className="flex" role="img" aria-label="Binary frame layout: version (1 byte), type (1 byte), length (4 bytes), payload (length bytes)">
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex flex-col items-center justify-center gap-1 border-r border-quicx-line px-4 py-5 last:border-r-0"
            style={{ flex: f.flex }}
          >
            <span
              className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] font-semibold"
              style={{ color: f.color }}
            >
              {f.label}
            </span>
            <span className="text-[10.5px] tracking-wider text-quicx-dim">
              {f.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between border-t border-quicx-line bg-white/[0.02] px-4 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-quicx-dim">
        <span>total header = <span className="text-quicx-muted">6 bytes fixed</span></span>
        <span>total message = <span className="text-quicx-muted">6 + length bytes</span></span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §01 · INSTALLATION
 * ════════════════════════════════════════════════════════════════ */

function InstallationSection() {
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
          The installer is a small POSIX <InlineCode>sh</InlineCode> script — it
          works on{" "}
          <strong>Linux (x86_64 / arm64)</strong> and{" "}
          <strong>macOS (Intel / Apple Silicon)</strong> without any additional
          tooling. No runtime dependencies, no package manager, no JDK. The
          Java client is distributed separately through Maven Central (see{" "}
          <a href="#quick-start">Quick Start</a>).
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
          Prefer to inspect the script first? Download it, read it, then run
          it — everything the installer does is visible plaintext:
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
                Reads <InlineCode>uname -s</InlineCode> and{" "}
                <InlineCode>uname -m</InlineCode> to pick the right artifact
                — <InlineCode>linux-x86_64</InlineCode>,{" "}
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
                Checks the SHA‑256 against the signed{" "}
                <InlineCode>SHA256SUMS</InlineCode> file. Exits non-zero if the
                hash does not match.
              </>
            ),
          },
          {
            term: "4 · install",
            def: (
              <>
                Places the <InlineCode>quicx</InlineCode> binary in{" "}
                <InlineCode>/usr/local/bin</InlineCode> (or{" "}
                <InlineCode>~/.local/bin</InlineCode> if the user does not have
                root). Writes a default{" "}
                <InlineCode>quicx.conf</InlineCode> to{" "}
                <InlineCode>~/.config/quicx/</InlineCode>.
              </>
            ),
          },
          {
            term: "5 · verify",
            def: (
              <>
                Runs <InlineCode>quicx version</InlineCode> and prints the
                resolved install path so you know the <InlineCode>PATH</InlineCode>{" "}
                lookup works.
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
quicx v1.0.0
`}
      />

      <Callout variant="tip" title="Offline / airgapped installs">
        Download the release archive directly from{" "}
        <a href="https://github.com/nefara/quicx/releases">
          github.com/nefara/quicx/releases
        </a>
        , copy the binary into your image, and drop the{" "}
        <InlineCode>quicx.conf</InlineCode> from{" "}
        <a href="#configuration">Configuration</a> alongside it. No network
        access is required at runtime — Quicx never calls home.
      </Callout>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §02 · QUICK START
 * ════════════════════════════════════════════════════════════════ */

function QuickStartSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 01.02"
        kicker="Getting Started"
        title="Quick Start"
        id="quick-start"
        lede="Start the daemon with quicx start, pull the Java client from Maven Central, and submit your first task. End-to-end in under a minute."
      />

      <ol className="space-y-6">
        <Step index="01" title="Start the daemon">
          <Prose>
            <p>
              Quicx needs a configuration file to know which TCP port to bind
              and how to carve up the PMAD pool. The installer writes a sensible
              default to <InlineCode>~/.config/quicx/quicx.conf</InlineCode> —
              see <a href="#configuration">Configuration</a> for every knob.
            </p>
          </Prose>

          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx start --config /etc/quicx/quicx.conf
config loaded: /etc/quicx/quicx.conf
quicx v1.0.0 starting
  port:    16381
  classes: 32 64 128 256 512 1024
quicx listening on port 16381 [kqueue]
quicx cli socket: /tmp/quicx.sock`}
          />
        </Step>

        <Step index="02" title="Add the Java client to your build">
          <Prose>
            <p>
              The client lives on Maven Central under{" "}
              <InlineCode>dev.quicx:quicx-client</InlineCode>. It&rsquo;s a tiny
              jar (no transitive dependencies) that speaks the Quicx binary
              protocol directly.
            </p>
          </Prose>

          <Tabs
            tabs={[
              {
                id: "maven",
                label: "Maven",
                content: (
                  <CodeBlock
                    filename="pom.xml"
                    language="xml"
                    code={`<dependency>
  <groupId>dev.quicx</groupId>
  <artifactId>quicx-client</artifactId>
  <version>1.0.0</version>
</dependency>`}
                  />
                ),
              },
              {
                id: "gradle",
                label: "Gradle (Kotlin)",
                content: (
                  <CodeBlock
                    filename="build.gradle.kts"
                    language="kotlin"
                    code={`dependencies {
    implementation("dev.quicx:quicx-client:1.0.0")
}`}
                  />
                ),
              },
              {
                id: "gradle-groovy",
                label: "Gradle (Groovy)",
                content: (
                  <CodeBlock
                    filename="build.gradle"
                    language="groovy"
                    code={`dependencies {
    implementation 'dev.quicx:quicx-client:1.0.0'
}`}
                  />
                ),
              },
            ]}
          />
        </Step>

        <Step index="03" title="Submit your first task">
          <Prose>
            <p>
              <InlineCode>QuicxClient</InlineCode> is a stateless, thread-safe
              producer handle. Every <InlineCode>submit()</InlineCode> opens a
              connection, sends <InlineCode>MSG_SUBMIT</InlineCode>, reads the
              acknowledgment, and closes — so you can treat it exactly like an
              HTTP call. The full wire format is documented in{" "}
              <a href="#binary-protocol">Binary Protocol</a>.
            </p>
          </Prose>

          <CodeBlock
            filename="Producer.java"
            language="java"
            code={`import dev.quicx.QuicxClient;

public class Producer {
    public static void main(String[] args) throws Exception {
        try (QuicxClient client = new QuicxClient("localhost", 16381)) {
            int taskId = client.submit(
                "send_email",
                "{\\"to\\":\\"user@gmail.com\\"}"
            );
            System.out.println("accepted task id = " + taskId);
        }
    }
}`}
          />
        </Step>

        <Step index="04" title="Run a worker">
          <Prose>
            <p>
              <InlineCode>QuicxWorker</InlineCode> connects, announces itself
              with <InlineCode>MSG_READY</InlineCode> and then blocks receiving
              <InlineCode>MSG_TASK</InlineCode> frames. Register one handler per
              task type; the worker reconnects automatically on daemon restarts.
            </p>
          </Prose>

          <CodeBlock
            filename="EmailWorker.java"
            language="java"
            code={`import dev.quicx.QuicxWorker;

public class EmailWorker {
    public static void main(String[] args) throws Exception {
        new QuicxWorker("localhost", 16381)
            .handle("send_email", payload -> {
                String body = new String(payload, "UTF-8");
                System.out.println("delivering: " + body);
                // ... do the work ...
            })
            .start();   // blocks — runs until the process is killed
    }
}`}
          />
        </Step>
      </ol>

      <Callout variant="perf" title="What just happened?">
        The producer opened a short-lived TCP connection, framed a{" "}
        <InlineCode>MSG_SUBMIT</InlineCode> with a 6‑byte header and a typed
        payload, then waited for a 4‑byte <InlineCode>task_id</InlineCode>.
        The daemon allocated every scratch buffer out of the PMAD pool — no
        <InlineCode>malloc</InlineCode>, no GC pause — and handed the task to
        an idle worker. One daemon. No moving parts.
      </Callout>
    </section>
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative grid grid-cols-1 gap-4 md:grid-cols-[96px_1fr] md:gap-6">
      <div className="flex items-start gap-3 md:flex-col md:items-end md:gap-2">
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-[0.3em] text-quicx-dim">
          Step
        </span>
        <span className="hero-display text-[28px] leading-none text-quicx-orange">
          {index}
        </span>
      </div>
      <div className="space-y-4">
        <h3 className="font-[family-name:var(--font-archivo)] text-[18px] font-semibold text-quicx-text">
          {title}
        </h3>
        {children}
      </div>
    </li>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §03 · CONFIGURATION
 * ════════════════════════════════════════════════════════════════ */

function ConfigurationSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 01.03"
        kicker="Getting Started"
        title="Configuration"
        id="configuration"
        lede="A Quicx daemon reads its entire runtime shape from a single quicx.conf file. Every number is exact — block counts, pool share, port — and is resolved before a byte of task traffic moves."
      />

      <CodeBlock
        filename="quicx.conf"
        language="conf"
        code={`# Quicx config
[server]
port = 16381

[allocator]
pool_size = 1048576
class = 32,10
class = 64,25
class = 128,25
class = 256,20
class = 512,12
class = 1024,8`}
      />

      <SubHeading id="server-block">[server]</SubHeading>

      <KeyList
        items={[
          {
            term: "port",
            def: (
              <>
                TCP port the daemon binds to. Producers and workers both dial
                the same port — routing is decided by the first message they
                send (<InlineCode>MSG_SUBMIT</InlineCode> vs{" "}
                <InlineCode>MSG_READY</InlineCode>). Default:{" "}
                <InlineCode>16381</InlineCode>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="allocator-block">[allocator]</SubHeading>

      <Prose>
        <p>
          The <InlineCode>allocator</InlineCode> block is parsed directly into
          the <a href="#pmad-allocator">PMAD</a> initializer. You own every
          byte of the pool — no hidden reserves, no growth. All arithmetic is
          performed at startup so the daemon either boots with the layout you
          asked for or refuses to start.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "pool_size",
            def: (
              <>
                Total bytes reserved via a single <InlineCode>mmap</InlineCode>{" "}
                call. Default is <InlineCode>1048576</InlineCode> (1 MiB). The
                allocator never grows past this number — if you exhaust it, new
                <InlineCode>MSG_SUBMIT</InlineCode> frames are rejected with{" "}
                <InlineCode>MSG_ERROR&nbsp;0x01&nbsp;(queue full)</InlineCode>.
              </>
            ),
          },
          {
            term: "class = SIZE,PCT",
            def: (
              <>
                Declares one size class: <strong>SIZE</strong> is the block
                size in bytes, <strong>PCT</strong> is the percentage of the
                pool that belongs to that class. Declare the classes in
                ascending <strong>SIZE</strong> order. The percentages must sum
                to <InlineCode>100</InlineCode>; if they don&rsquo;t, the
                daemon refuses to start.
              </>
            ),
          },
        ]}
      />

      <Callout variant="note" title="How the example pool is carved up">
        <InlineCode>pool_size = 1 MiB</InlineCode> with the six classes above
        resolves to exactly{" "}
        <InlineCode>3 276 · 32B</InlineCode> +{" "}
        <InlineCode>4 096 · 64B</InlineCode> +{" "}
        <InlineCode>2 048 · 128B</InlineCode> +{" "}
        <InlineCode>819 · 256B</InlineCode> +{" "}
        <InlineCode>245 · 512B</InlineCode> +{" "}
        <InlineCode>82 · 1024B</InlineCode> — all computed before the daemon
        accepts its first connection.
      </Callout>

      <SubHeading id="tuning-rules">Tuning rules of thumb</SubHeading>

      <Table
        headers={["Workload", "Recommended shape", "Why"]}
        rows={[
          [
            "Short JSON payloads (webhooks, emails)",
            <InlineCode key="a">32, 64, 128</InlineCode>,
            "Most MSG_SUBMIT frames land between 40–120 bytes; three tight classes eat the long tail with <5 % slack.",
          ],
          [
            "Mixed media (thumbnails, ML prompts)",
            <InlineCode key="b">128, 512, 2048</InlineCode>,
            "Two orders of magnitude spread — weight the biggest class heaviest.",
          ],
          [
            "Uniform binary blobs",
            <InlineCode key="c">one class at 100 %</InlineCode>,
            "Zero internal fragmentation. Highest throughput — see the PMAD benchmarks.",
          ],
        ]}
      />

      <Callout variant="warn" title="Validation is strict on purpose">
        If <InlineCode>pool_size</InlineCode> is not a multiple of every
        declared class size, or if the percentages don&rsquo;t sum to 100, the
        daemon exits with a precise error pointing at the offending line. This
        is deliberate — Quicx refuses to start in a &ldquo;mostly-correct&rdquo;
        state.
      </Callout>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §04 · ARCHITECTURE
 * ════════════════════════════════════════════════════════════════ */

function ArchitectureSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 02.01"
        kicker="Core Concepts"
        title="Architecture"
        id="architecture"
        lede="One daemon, three role-based endpoints, one allocator. Every moving piece is visible in a single diagram — and intentionally, no piece is optional."
      />

      <div className="relative overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22] p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
        <ArchitectureDiagram />
      </div>

      <Prose>
        <p>
          Quicx is deliberately flat. A single <strong>daemon</strong> process
          owns the task queue, the worker pool and the PMAD allocator.
          Producers and workers are plain TCP clients that speak the same
          binary protocol — the first frame they send tells the daemon which
          role they&rsquo;re playing.
        </p>
        <p>
          There are exactly three horizontal message paths:
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "producer → daemon",
            def: (
              <>
                <InlineCode>MSG_SUBMIT</InlineCode> lands a new task. The
                daemon responds with either{" "}
                <InlineCode>MSG_OK&nbsp;{"{task_id}"}</InlineCode> or{" "}
                <InlineCode>MSG_ERROR&nbsp;{"{code}"}</InlineCode> — always,
                within one round-trip. No streaming, no batching, no
                surprises.
              </>
            ),
          },
          {
            term: "daemon → worker",
            def: (
              <>
                Workers announce themselves with <InlineCode>MSG_READY</InlineCode>{" "}
                and block reading. The daemon pushes{" "}
                <InlineCode>MSG_TASK</InlineCode> frames to the first idle
                worker. If the queue is empty, the daemon replies with{" "}
                <InlineCode>MSG_WAIT</InlineCode> instead of keeping a pending
                read open.
              </>
            ),
          },
          {
            term: "worker → daemon",
            def: (
              <>
                <InlineCode>MSG_DONE&nbsp;{"{task_id}"}</InlineCode> on
                success, <InlineCode>MSG_FAILED&nbsp;{"{task_id, reason}"}</InlineCode>{" "}
                on failure. <InlineCode>MSG_HEARTBEAT</InlineCode> /{" "}
                <InlineCode>MSG_PONG</InlineCode> keep the socket from
                half-closing under long idle.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="single-daemon-design">Why a single daemon?</SubHeading>

      <Prose>
        <p>
          Multi-node queues pay a tax in the form of leader elections,
          replication logs and consistent hashing. Quicx is optimised for the
          much more common case where your queue lives on the <strong>same
            host</strong> (or at worst, the same availability zone) as your
          producers and workers. One daemon is enough to saturate a 10 GbE NIC
          with short tasks and — because of PMAD — it does so with{" "}
          <strong>zero allocation jitter</strong> under sustained load.
        </p>
        <p>
          Scaling horizontally means running multiple independent Quicx
          daemons behind a simple TCP load balancer. Because every socket is
          stateless at the protocol level (a submit is one request, one
          reply), there is no session to pin and no replication to coordinate.
        </p>
      </Prose>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §05 · PMAD ALLOCATOR
 * ════════════════════════════════════════════════════════════════ */

function PmadSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 02.02"
        kicker="Core Concepts"
        title="PMAD — Predictive Memory Allocator"
        id="pmad-allocator"
        lede="A slab allocator written in C that delivers O(1) allocation and deallocation with zero fragmentation and zero system calls at runtime. Every allocation the daemon makes — task envelopes, wire buffers, worker registration slots — comes out of PMAD. Fragmentation is 0 % by design: every block is pre-sized to a declared class, so there is no splitting, no coalescing, and no wasted space."
      />

      <Prose>
        <p>
          PMAD pre-allocates a contiguous pool of memory with a single{" "}
          <InlineCode>mmap</InlineCode> call at startup, then partitions it
          into user-defined size classes. Standard allocators (ptmalloc,
          jemalloc v5.3, tcmalloc v2026) optimise for average-case throughput
          — PMAD optimises for <strong>worst-case determinism</strong> and
          predictable latency budgets.
        </p>
      </Prose>

      <Table
        headers={["Domain", "Why PMAD fits"]}
        rows={[
          [
            "Real-time systems",
            "Guaranteed O(1) response — no lock contention, no syscalls at runtime",
          ],
          [
            "Embedded / RTOS",
            "Minimal footprint, no heap fragmentation, fully configurable memory layout",
          ],
          [
            "Game engines",
            "Predictable frame-time budgets with zero allocation jitter",
          ],
          [
            "High-frequency trading",
            "Nanosecond-class allocation latency under sustained throughput",
          ],
        ]}
      />

      <SubHeading id="pmad-architecture">Architecture</SubHeading>

      <Prose>
        <p>
          Every allocation is a single lookup-table index followed by a
          free-list pop. Every deallocation is a free-list push keyed by the
          block&rsquo;s own header. Both operations have no conditional branch
          paths — the fast path <em>is</em> the only path.
        </p>
      </Prose>

      {/* PMAD diagram — drop the PDF export into /public/pmad-architecture.png
          (or .svg) and the component will render it inline. Until the asset is
          added, a branded placeholder shows. */}
      <div className="relative overflow-hidden rounded-2xl border border-quicx-line bg-white p-4 sm:p-6">
        <Image
          src="/pmad-architecture.png"
          alt="PMAD — Predictive Memory Allocator architecture overview"
          width={1920}
          height={1760}
          className="h-auto w-full"
          priority={false}
        />
      </div>

      <KeyList
        items={[
          {
            term: "Public API",
            def: (
              <>
                The thin facade in <InlineCode>incPMAD.h</InlineCode> —{" "}
                <InlineCode>pmad_init</InlineCode>,{" "}
                <InlineCode>pmad_alloc</InlineCode>,{" "}
                <InlineCode>pmad_free</InlineCode>,{" "}
                <InlineCode>pmad_destroy</InlineCode>. This is the entire
                contract the daemon consumes.
              </>
            ),
          },
          {
            term: "Size Class Table",
            def: (
              <>
                A flat array{" "}
                <InlineCode>[MAX_SIZE / ALIGNMENT]</InlineCode> maps a
                requested byte-count directly to the correct size-class
                descriptor — an O(1) table lookup, no branches.
              </>
            ),
          },
          {
            term: "Free Lists",
            def: (
              <>
                Each size class owns a singly-linked intrusive free list. A
                pop is a pointer dereference; a push is a pointer swap. No
                atomics on the fast path — the daemon serialises through its
                own router, so locks are structurally unnecessary.
              </>
            ),
          },
          {
            term: "Memory Pool",
            def: (
              <>
                One <InlineCode>mmap</InlineCode> region split into contiguous
                runs of blocks, one run per class, sized by the user
                percentages. Each block carries a 16-byte{" "}
                <InlineCode>BlockHeader</InlineCode>{" "}
                (<InlineCode>next</InlineCode> pointer + class ID) so
                deallocations need no external metadata.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="pmad-benchmarks">Benchmarks</SubHeading>

      <Prose>
        <p>
          Measured on Apple Silicon (<InlineCode>-O3 -march=native</InlineCode>).
          Full benchmark source and reproduction instructions are available on{" "}
          <a href="https://github.com/anastassow/PMAD">
            github.com/anastassow/PMAD
          </a>.
        </p>
      </Prose>

      <Table
        headers={[
          "Metric",
          "Value",
        ]}
        rows={[
          ["Sustained allocation latency", <strong key="pl">19.1 ns</strong>],
          ["Peak throughput", ">460 M ops/s"],
          ["Jitter (σ)", "0.0 ns (deterministic)"],
          ["Fragmentation", "0 %"],
          ["Runtime syscalls", "Zero"],
          ["Configurability", "Fully user-defined size classes"],
        ]}
      />

      <SubHeading id="pmad-configurations">Reference configurations</SubHeading>

      <Table
        headers={[
          "Profile",
          "Size classes (B)",
          "Split (%)",
          "Avg. latency",
          "Throughput",
          "Suitability",
        ]}
        rows={[
          [
            "Max throughput",
            <InlineCode key="a">{"{16}"}</InlineCode>,
            "100",
            "19.1 ns",
            "436.9 M/s",
            "Small-object velocity",
          ],
          [
            "Min overhead",
            <InlineCode key="b">{"{4096}"}</InlineCode>,
            "100",
            "19.7 ns",
            "254.0 M/s",
            "Bulk data density",
          ],
          [
            "Balanced",
            <InlineCode key="c">{"{64, 256, 1024}"}</InlineCode>,
            "60 / 30 / 10",
            "20.6 ns",
            "462.6 M/s",
            "Mixed workloads",
          ],
          [
            "Latency-optimised",
            <InlineCode key="d">{"{32, 128}"}</InlineCode>,
            "80 / 20",
            "19.8 ns",
            "426.2 M/s",
            "Critical signalling",
          ],
          [
            "HFT / network",
            <InlineCode key="e">{"{32, 128, 512, …}"}</InlineCode>,
            "60 / 20 / …",
            "24.7 ns",
            "397.2 M/s",
            "L3 packet processing",
          ],
          [
            "Embedded / RTOS",
            <InlineCode key="f">{"{8, 16, 32, …}"}</InlineCode>,
            "30 / 30 / …",
            "22.3 ns",
            "327.7 M/s",
            "Deterministic control",
          ],
        ]}
      />

      <Callout variant="perf" title="What these numbers actually mean">
        <strong className="text-quicx-text">Zero jitter</strong> is not
        marketing — PMAD&rsquo;s instruction path is identical for every
        allocation, so the only variance you can measure is system-level
        noise. <strong className="text-quicx-text">Zero runtime syscalls</strong>{" "}
        means kernel scheduling never interrupts an allocation. Your{" "}
        1 000 000<sup>th</sup> <InlineCode>pmad_alloc</InlineCode> is as fast
        as your first.
      </Callout>

      <SubHeading id="pmad-teardown">Tear-down</SubHeading>

      <Prose>
        <p>
          A single <InlineCode>munmap</InlineCode> returns the entire pool to
          the OS in O(1) — there are no individual blocks to walk, no
          fragmented regions to compact. Shutdown is symmetric with startup:
          one syscall in, one syscall out.
        </p>
      </Prose>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §06 · BINARY PROTOCOL
 * ════════════════════════════════════════════════════════════════ */

function BinaryProtocolSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 02.03"
        kicker="Core Concepts"
        title="Binary Protocol"
        id="binary-protocol"
        lede="Every frame on the wire is a 6-byte header followed by a variable-length payload. No framing ambiguity, no partial reads, no text encoding — parsing is a couple of pointer reads."
      />

      <SubHeading id="protocol-frame-header">Frame header</SubHeading>

      <FrameDiagram />

      <KeyList
        items={[
          {
            term: "version",
            def: "Protocol revision. Currently 0x01. The daemon rejects any other version with MSG_ERROR 0x02 so protocol evolution is additive and opt-in.",
          },
          {
            term: "type",
            def: "Message opcode — one of the 11 types below. The daemon routes on type alone; producers and workers speak the same header shape.",
          },
          {
            term: "length",
            def: "32-bit big-endian unsigned integer: the payload size in bytes. Zero is legal for MSG_READY, MSG_WAIT, MSG_HEARTBEAT, MSG_PONG and MSG_STATS.",
          },
          {
            term: "payload",
            def: "Exactly length bytes. The per-type layouts below are the full contract — there is no escaping, no delimiters and no padding.",
          },
        ]}
      />

      <SubHeading id="protocol-message-types">Message types</SubHeading>

      <OpcodeTable />

      <SubHeading id="payload-formats">Payload formats</SubHeading>

      <div className="space-y-6">
        <Payload
          hex="0x01"
          name="MSG_SUBMIT"
          direction="producer → daemon"
          layout={`[type_len : 1 byte][type : type_len bytes][payload : rest of bytes]`}
          example={`type = "send_email"
payload = {"to":"user@gmail.com"}
bytes   = [10][send_email][{"to":"user@gmail.com"}]`}
        />
        <Payload
          hex="0x02"
          name="MSG_OK"
          direction="daemon → producer"
          layout={`[task_id : 4 bytes]`}
          example={`task_id = 0x00000A42  →  accepted task id = 2626`}
        />
        <Payload
          hex="0x03"
          name="MSG_ERROR"
          direction="daemon → producer"
          layout={`[error_code : 1 byte][message : rest of bytes]`}
          extra={
            <Table
              headers={["Code", "Meaning"]}
              rows={[
                [<InlineCode key="1">0x01</InlineCode>, "queue full — PMAD pool exhausted"],
                [<InlineCode key="2">0x02</InlineCode>, "invalid message (bad version / length / type)"],
                [<InlineCode key="3">0x03</InlineCode>, "payload too large for the largest size class"],
                [<InlineCode key="4">0x04</InlineCode>, "unknown task type"],
              ]}
            />
          }
        />
        <Payload
          hex="0x04"
          name="MSG_READY"
          direction="worker → daemon"
          layout={`(no payload — length = 0)`}
          example={`Sent once per connection, immediately after connect, to register
the socket as an idle worker. The daemon replies with MSG_TASK or
MSG_WAIT.`}
        />
        <Payload
          hex="0x05"
          name="MSG_TASK"
          direction="daemon → worker"
          layout={`[task_id : 4 bytes][type_len : 1 byte][type : type_len bytes][payload : rest]`}
          example={`Mirror of MSG_SUBMIT with the task id prepended. The worker dispatches
by type and replies with MSG_DONE or MSG_FAILED carrying the same id.`}
        />
        <Payload
          hex="0x06"
          name="MSG_DONE"
          direction="worker → daemon"
          layout={`[task_id : 4 bytes]`}
          example={`Confirms successful completion. The daemon frees the task slot back
to PMAD before responding to any producer waiting on this id.`}
        />
        <Payload
          hex="0x07"
          name="MSG_FAILED"
          direction="worker → daemon"
          layout={`[task_id : 4 bytes][reason : rest of bytes]`}
          example={`reason is a UTF-8 string propagated verbatim to producers that
observe the task, and logged by the daemon. Keep it short — it lives
in the same size class as the original payload.`}
        />
        <Payload
          hex="0x08"
          name="MSG_WAIT"
          direction="daemon → worker"
          layout={`(no payload — length = 0)`}
          example={`Sent in place of MSG_TASK when the queue is empty. The worker keeps
the socket open and issues another MSG_READY after a short backoff.`}
        />
        <Payload
          hex="0x09"
          name="MSG_HEARTBEAT"
          direction="both directions"
          layout={`(no payload — length = 0)`}
          example={`Liveness probe. Either side may send it; the receiver replies with
MSG_PONG. Intended for long-idle worker sockets behind stateful
load balancers.`}
        />
        <Payload
          hex="0x0A"
          name="MSG_PONG"
          direction="both directions"
          layout={`(no payload — length = 0)`}
          example={`The only valid reply to MSG_HEARTBEAT. Shape-symmetric with
MSG_HEARTBEAT for trivial framing.`}
        />
        <Payload
          hex="0x0B"
          name="MSG_STATS"
          direction="monitor → daemon"
          layout={`(no payload — length = 0)`}
          example={`Requests a one-shot metrics snapshot. The daemon responds with
MSG_STATS_RESPONSE.`}
        />
        <Payload
          hex="0x0C"
          name="MSG_STATS_RESPONSE"
          direction="daemon → monitor"
          layout={`[queue_depth : 4 bytes][workers_total : 4 bytes][workers_idle : 4 bytes][pmad_bytes_used : 8 bytes][pmad_bytes_total : 8 bytes]`}
          example={`All integers are big-endian. The 28-byte body is a fixed shape so
dashboards can parse it without a schema.`}
        />
      </div>
    </section>
  );
}

function OpcodeTable() {
  const rows: [string, string, string][] = [
    ["0x01", "MSG_SUBMIT", "producer → daemon"],
    ["0x02", "MSG_OK", "daemon → producer"],
    ["0x03", "MSG_ERROR", "daemon → producer"],
    ["0x04", "MSG_READY", "worker → daemon"],
    ["0x05", "MSG_TASK", "daemon → worker"],
    ["0x06", "MSG_DONE", "worker → daemon"],
    ["0x07", "MSG_FAILED", "worker → daemon"],
    ["0x08", "MSG_WAIT", "daemon → worker"],
    ["0x09", "MSG_HEARTBEAT", "either direction"],
    ["0x0A", "MSG_PONG", "either direction"],
    ["0x0B", "MSG_STATS", "monitor → daemon"],
    ["0x0C", "MSG_STATS_RESPONSE", "daemon → monitor"],
  ];

  return (
    <Table
      highlight={1}
      headers={["Type", "Name", "Direction"]}
      rows={rows.map(([hex, name, dir]) => [
        <InlineCode key={hex}>{hex}</InlineCode>,
        <span
          key={name}
          className="font-[family-name:var(--font-jetbrains-mono)]"
        >
          {name}
        </span>,
        dir,
      ])}
    />
  );
}

function Payload({
  hex,
  name,
  direction,
  layout,
  example,
  extra,
}: {
  hex: string;
  name: string;
  direction: string;
  layout: string;
  example?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      id={`msg-${name.toLowerCase()}`}
      className="scroll-mt-24 rounded-lg border border-quicx-line bg-[#0a1a22] p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-2 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] text-quicx-orange-bright">
          {hex}
        </span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[15px] font-semibold text-quicx-text">
          {name}
        </span>
        <span className="font-[family-name:var(--font-barlow-condensed)] text-[11.5px] uppercase tracking-[0.2em] text-quicx-dim">
          {direction}
        </span>
      </div>
      <pre className="mt-4 overflow-x-auto rounded border border-white/5 bg-[#061219] px-3 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-relaxed text-quicx-text">
        <code>{layout}</code>
      </pre>
      {example && (
        <pre className="mt-3 overflow-x-auto rounded border border-white/5 bg-black/20 px-3 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11.5px] leading-relaxed text-quicx-muted">
          <code>{example}</code>
        </pre>
      )}
      {extra && <div className="mt-4">{extra}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §07 · CLI REFERENCE
 * ════════════════════════════════════════════════════════════════ */

function CliReferenceSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 03.01"
        kicker="Reference"
        title="CLI Reference"
        id="cli-reference"
        lede="quicx is the single binary that ships with the release. It is self-documenting — running it with no arguments prints the same usage you see below."
      />

      <CodeBlock
        window
        filename="~ $ quicx"
        language="sh"
        code={`quicx v1.0.0 — lightweight task queue daemon

usage:
  quicx start --config FILE
  quicx stop
  quicx status
  quicx version`}
      />

      <div className="space-y-6">
        <CliCommand
          cmd="quicx start --config FILE"
          title="start the daemon in the foreground"
        >
          <Prose>
            <p>
              Binds the port declared in <InlineCode>[server]</InlineCode>,
              maps the PMAD pool, and begins accepting connections. Runs in
              the foreground — the calling shell owns the process. Pair with
              systemd, <InlineCode>tmux</InlineCode>,{" "}
              <InlineCode>launchd</InlineCode> or your container supervisor
              for lifecycle management. See{" "}
              <a href="#configuration">Configuration</a> for the file format.
            </p>
          </Prose>
        </CliCommand>

        <CliCommand
          cmd="quicx stop"
          title="gracefully stop the local daemon"
        >
          <Prose>
            <p>
              Sends <InlineCode>SIGTERM</InlineCode> to the pid recorded in
              <InlineCode>/var/run/quicx.pid</InlineCode> (or{" "}
              <InlineCode>$XDG_RUNTIME_DIR/quicx.pid</InlineCode> for
              non-root installs). The daemon drains in-flight tasks,{" "}
              <InlineCode>munmap</InlineCode>s the PMAD pool and exits
              cleanly.
            </p>
          </Prose>
        </CliCommand>

        <CliCommand
          cmd="quicx status"
          title="live observation of the running daemon"
        >
          <Prose>
            <p>
              Opens a short-lived control connection over the{" "}
              <InlineCode>/tmp/quicx.sock</InlineCode> Unix socket and sends{" "}
              <InlineCode>MSG_STATS</InlineCode>, then renders the{" "}
              <InlineCode>MSG_STATS_RESPONSE</InlineCode> as a human-readable
              table. Shows <strong>uptime</strong>, <strong>worker pool state</strong>{" "}
              (idle / busy / total), <strong>queue depth</strong>,{" "}
              <strong>task counters</strong> (submitted / completed / failed),{" "}
              <strong>memory usage</strong> against the configured pool, and a
              per-size-class <strong>PMAD slab breakdown</strong> with
              utilisation bars. Safe to script — exits non-zero if the daemon is
              unreachable.
            </p>
          </Prose>

          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx status

  quicx v1.0.0
  ─────────────────────────────────────────
  uptime     0h 0m 6s

  workers    idle: 0     busy: 0     total: 0
  queue      waiting: 0

  tasks      submitted: 0
             completed: 0
             failed:    0

  memory     32 / 913408 bytes (0.0%)

  PMAD:
      32B  [░░░░░░░░░░░░░░░░░░░░]  1 / 2184
      64B  [░░░░░░░░░░░░░░░░░░░░]  0 / 3276
     128B  [░░░░░░░░░░░░░░░░░░░░]  0 / 1820
     256B  [░░░░░░░░░░░░░░░░░░░░]  0 / 770
     512B  [░░░░░░░░░░░░░░░░░░░░]  0 / 238
    1024B  [░░░░░░░░░░░░░░░░░░░░]  0 / 80

user@host ~ $`}
          />
        </CliCommand>

        <CliCommand
          cmd="quicx version"
          title="print the binary version + build metadata"
        >
          <Prose>
            <p>
              Prints the semver, build date and target triple. Machine-parsable
              if you pipe it — one line, space-separated.
            </p>
          </Prose>
        </CliCommand>
      </div>
    </section>
  );
}

function CliCommand({
  cmd,
  title,
  children,
}: {
  cmd: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-quicx-line bg-[#0a1a22] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex size-7 items-center justify-center rounded border border-quicx-orange/40 bg-quicx-orange/10 text-quicx-orange-bright">
          <TerminalIcon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <code className="block font-[family-name:var(--font-jetbrains-mono)] text-[13.5px] text-quicx-text">
            {cmd}
          </code>
          <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.24em] text-quicx-dim">
            {title}
          </div>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §08 · JAVA CLIENT
 * ════════════════════════════════════════════════════════════════ */

function JavaClientSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 03.02"
        kicker="Reference"
        title="Java Client"
        id="java-client"
        lede="dev.quicx:quicx-client is a small, dependency-free Java 11+ library. Two classes carry the whole surface area: QuicxClient for producers, QuicxWorker for consumers."
      />

      <SubHeading id="java-build-setup">Add it to your build</SubHeading>

      <Tabs
        tabs={[
          {
            id: "maven",
            label: "Maven",
            content: (
              <CodeBlock
                filename="pom.xml"
                language="xml"
                code={`<dependency>
  <groupId>dev.quicx</groupId>
  <artifactId>quicx-client</artifactId>
  <version>1.0.0</version>
</dependency>`}
              />
            ),
          },
          {
            id: "gradle",
            label: "Gradle",
            content: (
              <CodeBlock
                filename="build.gradle.kts"
                language="kotlin"
                code={`dependencies {
    implementation("dev.quicx:quicx-client:1.0.0")
}`}
              />
            ),
          },
        ]}
      />

      {/* ---------- QuicxClient ---------- */}
      <SubHeading id="QuicxClient">QuicxClient — producers</SubHeading>

      <Prose>
        <p>
          <InlineCode>QuicxClient</InlineCode> is stateless at the connection
          level: every call to <InlineCode>submit()</InlineCode> opens a fresh
          TCP connection, performs the submit request-reply, and closes. Keep
          the object around for the lifetime of the producer — it&rsquo;s safe
          to reuse and share across threads.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "new QuicxClient(host, port)",
            def: "Construct a reusable handle. No network work is performed here.",
          },
          {
            term: "int submit(type, byte[])",
            def: (
              <>
                Send a <InlineCode>MSG_SUBMIT</InlineCode> with a raw payload.
                Returns the 32-bit task id assigned by the daemon. Throws{" "}
                <InlineCode>QuicxException</InlineCode> on{" "}
                <InlineCode>MSG_ERROR</InlineCode>.
              </>
            ),
          },
          {
            term: "int submit(type, String)",
            def: (
              <>
                Convenience overload: UTF-8 encodes the payload for you.
              </>
            ),
          },
          {
            term: "close()",
            def: "Idempotent. Tears down any transport resources. Use try-with-resources.",
          },
        ]}
      />

      <CodeBlock
        filename="Producer.java"
        language="java"
        code={`import dev.quicx.QuicxClient;
import dev.quicx.QuicxException;

try (QuicxClient client = new QuicxClient("localhost", 16381)) {
    int id = client.submit(
        "resize_image",
        new byte[]{ 0x01, 0x02, 0x03 /* raw bytes */ }
    );
    System.out.println("accepted id = " + id);
} catch (QuicxException e) {
    // daemon rejected the task — rate-limit, retry or surface upstream
    System.err.println("rejected: " + e.getMessage());
}`}
      />

      {/* ---------- QuicxWorker ---------- */}
      <SubHeading id="QuicxWorker">QuicxWorker — consumers</SubHeading>

      <Prose>
        <p>
          <InlineCode>QuicxWorker</InlineCode> is a long-lived connection that
          receives <InlineCode>MSG_TASK</InlineCode> frames. Register a
          handler per task type; the worker dispatches by string key and
          replies to the daemon with <InlineCode>MSG_DONE</InlineCode> or{" "}
          <InlineCode>MSG_FAILED</InlineCode> automatically.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "new QuicxWorker(host, port)",
            def: "Construct a worker. No network work happens until start().",
          },
          {
            term: "handle(type, handler)",
            def: (
              <>
                Register a <InlineCode>TaskHandler</InlineCode> for a task
                type. Returns <InlineCode>this</InlineCode> for chaining.
                Handlers are keyed by the same <InlineCode>type</InlineCode>{" "}
                string the producer sent in{" "}
                <InlineCode>MSG_SUBMIT</InlineCode>.
              </>
            ),
          },
          {
            term: "start()",
            def: (
              <>
                Connect, send <InlineCode>MSG_READY</InlineCode> and enter the
                dispatch loop. Blocks forever. On an unexpected disconnect the
                worker sleeps for 3 s and reconnects — your handlers keep
                running across daemon restarts.
              </>
            ),
          },
          {
            term: "close()",
            def: "Flips the running flag, closes the socket and unblocks start(). Safe to call from a shutdown hook.",
          },
        ]}
      />

      <CodeBlock
        filename="Worker.java"
        language="java"
        code={`import dev.quicx.QuicxWorker;

public class Worker {
    public static void main(String[] args) throws Exception {
        QuicxWorker worker = new QuicxWorker("localhost", 16381)
            .handle("send_email", payload -> {
                String body = new String(payload, "UTF-8");
                EmailService.deliver(body);
            })
            .handle("resize_image", payload -> {
                Images.resize(payload);
            });

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try { worker.close(); } catch (Exception ignored) {}
        }));

        worker.start();   // blocks — the dispatch loop owns this thread
    }
}`}
      />

      <Callout variant="note" title="Error semantics">
        If a handler throws, the worker sends{" "}
        <InlineCode>MSG_FAILED</InlineCode> with{" "}
        <InlineCode>exception.getMessage()</InlineCode> as the reason — the
        task is not retried automatically. If no handler is registered for an
        incoming type, the worker logs and sends{" "}
        <InlineCode>MSG_FAILED</InlineCode> with{" "}
        <InlineCode>&ldquo;no handler for: …&rdquo;</InlineCode>.
      </Callout>

      {/* ---------- QuicxException ---------- */}
      <SubHeading id="QuicxException">QuicxException</SubHeading>

      <Prose>
        <p>
          An unchecked <InlineCode>RuntimeException</InlineCode> thrown by{" "}
          <InlineCode>QuicxClient#submit</InlineCode> on rejection or
          protocol error. It wraps the daemon&rsquo;s{" "}
          <InlineCode>MSG_ERROR</InlineCode> message string so the cause is
          visible without decoding bytes by hand.
        </p>
      </Prose>

      <CodeBlock
        filename="QuicxException.java"
        language="java"
        code={`package dev.quicx;

public class QuicxException extends RuntimeException {
    public QuicxException(String message) { super(message); }
    public QuicxException(String message, Throwable cause) {
        super(message, cause);
    }
}`}
      />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
 *  §09 · CHANGELOG
 * ════════════════════════════════════════════════════════════════ */

function ChangelogSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        num="§ 03.03"
        kicker="Reference"
        title="Changelog"
        id="changelog"
        lede="Quicx follows semver. Breaking protocol changes bump the major version; new message types are additive and bump minor. Patch releases are build-or-docs-only."
      />

      <ul className="space-y-6">
        <Release
          version="v1.0.0"
          date="2026-04-21"
          status="Current"
          highlights={[
            "First public release.",
            "Binary protocol frozen — 12 message types, 6-byte header, versioned.",
            "PMAD v1 — O(1) slab allocator with user-defined size classes.",
            "Java client published to Maven Central as dev.quicx:quicx-client.",
            "Install script for Linux (x86_64, arm64) and macOS (Intel, Apple Silicon).",
          ]}
        />
      </ul>

      <Callout variant="tip" title="Subscribe to release notes">
        The canonical source of release notes is the{" "}
        <a href="https://github.com/nefara/quicx/releases">
          GitHub releases page
        </a>
        . Watch the repository for notifications — every release bundles a
        signed tarball plus the matching{" "}
        <InlineCode>SHA256SUMS</InlineCode>.
      </Callout>
    </section>
  );
}

function Release({
  version,
  date,
  status,
  highlights,
}: {
  version: string;
  date: string;
  status: string;
  highlights: string[];
}) {
  return (
    <li className="rounded-lg border border-quicx-line bg-[#0a1a22] p-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[18px] font-semibold text-quicx-text">
          {version}
        </span>
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-quicx-dim">
          {date}
        </span>
        <span className="rounded border border-quicx-orange/40 bg-quicx-orange/10 px-2 py-0.5 font-[family-name:var(--font-barlow-condensed)] text-[10.5px] uppercase tracking-[0.26em] text-quicx-orange-bright">
          {status}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-[13.5px] text-quicx-muted">
        {highlights.map((h, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-quicx-orange"
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

/* ─────────────── Footer CTA ─────────────── */

function DocsPageFooterCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-quicx-line bg-[#0a1a22] p-8 sm:p-12">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(255,87,0,0.08),transparent_60%)]" />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <div className="font-[family-name:var(--font-barlow-condensed)] text-[11px] uppercase tracking-[0.3em] text-quicx-orange-bright">
            Ready to run it?
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-archivo)] text-[22px] font-semibold leading-tight text-quicx-text">
            Configure it once. Run it forever.
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-quicx-muted">
            One binary, one TOML file, a Java jar on Maven Central. The rest
            is just taking tasks off a queue.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="#installation"
            className="inline-flex items-center gap-2 rounded border border-quicx-orange bg-quicx-orange/10 px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-orange-bright transition hover:bg-quicx-orange/20"
          >
            Install Quicx <ArrowRight className="size-4" />
          </Link>
          <a
            href="https://github.com/anastassow/Quicx"
            className="inline-flex items-center gap-2 rounded border border-quicx-line px-4 py-2 font-[family-name:var(--font-barlow-condensed)] text-[14px] font-semibold uppercase tracking-wide text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
          >
            GitHub <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
