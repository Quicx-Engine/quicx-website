import React from "react";
import Link from "next/link";
import { CURRENT_VERSION } from "@/lib/version";
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
    <li className="grid grid-cols-1 gap-4 border-t border-quicx-line pt-8 first:border-t-0 first:pt-0 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-6">
      <span aria-hidden className="display text-[44px] leading-none text-quicx-orange">
        {index}
      </span>
      <div className="min-w-0 space-y-5">
        <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text">
          <span className="sr-only">Step {index}: </span>
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

      <ol className="space-y-10">
        <Step index="01" title="Start the daemon">
          <Prose>
            <p>
              <InlineCode>quicx start</InlineCode> runs with sensible defaults — port 16381 and an
              8 MiB memory budget — so a config file is optional. To change them, start from the
              reference file in <Link href="/docs/configuration">Configuration</Link>; this example
              keeps it at <InlineCode>/etc/quicx/quicx.conf</InlineCode>.
            </p>
          </Prose>
          <CodeBlock
            window
            filename="~ $"
            language="sh"
            code={`user@host ~ $ quicx start --config /etc/quicx/quicx.conf\nconfig loaded: /etc/quicx/quicx.conf\nquicx v${CURRENT_VERSION} starting
  port:    16381
  pool:    8388608 bytes, 16 KiB pages given to block sizes on demand
  apool:   reserve, hardening, purge
  pages:   508 for tasks (63 kept warm, 7 reserved), 3 for connections and workers
quicx listening on port 16381 [kqueue]
quicx cli socket: /tmp/quicx.sock`}
          />
        </Step>

        <Step index="02" title="Add the Java client to your build">
          <Prose>
            <p>
              The client lives on Maven Central under{" "}
              <InlineCode>dev.quicx:quicx-client</InlineCode>. It&rsquo;s a tiny jar (no
              transitive dependencies) that speaks QXP, the Quicx Protocol, directly.
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
  <version>2.0.0</version>
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
    implementation("dev.quicx:quicx-client:2.0.0")
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
    implementation 'dev.quicx:quicx-client:2.0.0'
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
              <InlineCode>QuicxClient</InlineCode> is a thread-safe producer handle that keeps
              one connection to the daemon. <InlineCode>submit()</InlineCode> sends{" "}
              <InlineCode>MSG_SUBMIT</InlineCode> and returns the task id once the daemon has
              queued it; <InlineCode>submitAndWait()</InlineCode> also waits for the result.
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
        waited for a 4‑byte <InlineCode>task_id</InlineCode>. The daemon put the task into
        one block of its fixed budget — no <InlineCode>malloc</InlineCode>, no GC pause — and
        handed it to an idle worker. One daemon. No moving parts.
      </Callout>
    </section>
  );
}
