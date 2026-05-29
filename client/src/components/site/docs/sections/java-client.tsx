import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import { Tabs } from "@/components/site/docs/Tabs";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
} from "@/components/site/docs/_primitives";

export function JavaClientSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="java-client" />

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

      <SubHeading id="QuicxClient">QuicxClient — producers</SubHeading>

      <Prose>
        <p>
          <InlineCode>QuicxClient</InlineCode> is stateless at the connection level: every
          call to <InlineCode>submit()</InlineCode> opens a fresh TCP connection, performs
          the submit request-reply, and closes. Keep the object around for the lifetime of
          the producer — it&rsquo;s safe to reuse and share across threads.
        </p>
      </Prose>

      <KeyList
        items={[
          { term: "new QuicxClient(host, port)", def: "Construct a reusable handle. No network work is performed here." },
          {
            term: "int submit(type, byte[])",
            def: (
              <>
                Send a <InlineCode>MSG_SUBMIT</InlineCode> with a raw payload. Returns the
                32-bit task id assigned by the daemon. Throws{" "}
                <InlineCode>QuicxException</InlineCode> on{" "}
                <InlineCode>MSG_ERROR</InlineCode>.
              </>
            ),
          },
          {
            term: "int submit(type, String)",
            def: "Convenience overload: UTF-8 encodes the payload for you.",
          },
          { term: "close()", def: "Idempotent. Tears down any transport resources. Use try-with-resources." },
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
    System.err.println("rejected: " + e.getMessage());
}`}
      />

      <SubHeading id="QuicxWorker">QuicxWorker — consumers</SubHeading>

      <Prose>
        <p>
          <InlineCode>QuicxWorker</InlineCode> is a long-lived connection that receives{" "}
          <InlineCode>MSG_TASK</InlineCode> frames. Register a handler per task type; the
          worker dispatches by string key and replies to the daemon with{" "}
          <InlineCode>MSG_DONE</InlineCode> or <InlineCode>MSG_FAILED</InlineCode>{" "}
          automatically.
        </p>
      </Prose>

      <KeyList
        items={[
          { term: "new QuicxWorker(host, port)", def: "Construct a worker. No network work happens until start()." },
          {
            term: "handle(type, handler)",
            def: (
              <>
                Register a <InlineCode>TaskHandler</InlineCode> for a task type. Returns{" "}
                <InlineCode>this</InlineCode> for chaining.
              </>
            ),
          },
          {
            term: "start()",
            def: (
              <>
                Connect, send <InlineCode>MSG_READY</InlineCode> and enter the dispatch loop.
                Blocks forever. On an unexpected disconnect the worker sleeps for 3 s and
                reconnects.
              </>
            ),
          },
          { term: "close()", def: "Flips the running flag, closes the socket and unblocks start(). Safe to call from a shutdown hook." },
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
        If a handler throws, the worker sends <InlineCode>MSG_FAILED</InlineCode> with{" "}
        <InlineCode>exception.getMessage()</InlineCode> as the reason — the task is not
        retried automatically. If no handler is registered for an incoming type, the worker
        logs and sends <InlineCode>MSG_FAILED</InlineCode> with{" "}
        <InlineCode>&ldquo;no handler for: …&rdquo;</InlineCode>.
      </Callout>

      <SubHeading id="QuicxException">QuicxException</SubHeading>

      <Prose>
        <p>
          An unchecked <InlineCode>RuntimeException</InlineCode> thrown by{" "}
          <InlineCode>QuicxClient#submit</InlineCode> on rejection or protocol error. It wraps
          the daemon&rsquo;s <InlineCode>MSG_ERROR</InlineCode> message string so the cause is
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
