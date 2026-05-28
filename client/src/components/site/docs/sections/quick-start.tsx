import React from "react";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import { Tabs } from "@/components/site/docs/Tabs";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
} from "@/components/site/docs/_primitives";

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

export function QuickStartSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="quick-start" />

      <ol className="space-y-6">
        <Step index="01" title="Start the daemon">
          <Prose>
            <p>
              Quicx needs a configuration file to know which TCP port to bind and how to
              carve up the PMAD pool. The installer writes a sensible default to{" "}
              <InlineCode>~/.config/quicx/quicx.conf</InlineCode>.
            </p>
          </Prose>
          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx start --config /etc/quicx/quicx.conf
config loaded: /etc/quicx/quicx.conf
quicx v1.0.1 starting
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
              <InlineCode>dev.quicx:quicx-client</InlineCode>. It&rsquo;s a tiny jar (no
              transitive dependencies) that speaks the Quicx binary protocol directly.
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
              <InlineCode>QuicxClient</InlineCode> is a stateless, thread-safe producer
              handle. Every <InlineCode>submit()</InlineCode> opens a connection, sends{" "}
              <InlineCode>MSG_SUBMIT</InlineCode>, reads the acknowledgment, and closes.
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
              <InlineCode>QuicxWorker</InlineCode> connects, announces itself with{" "}
              <InlineCode>MSG_READY</InlineCode> and then blocks receiving{" "}
              <InlineCode>MSG_TASK</InlineCode> frames. The worker reconnects automatically
              on daemon restarts.
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
        <InlineCode>MSG_SUBMIT</InlineCode> with a 6‑byte header and a typed payload, then
        waited for a 4‑byte <InlineCode>task_id</InlineCode>. The daemon allocated every
        scratch buffer out of the PMAD pool — no <InlineCode>malloc</InlineCode>, no GC
        pause — and handed the task to an idle worker. One daemon. No moving parts.
      </Callout>
    </section>
  );
}
