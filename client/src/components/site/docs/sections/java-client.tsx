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
  <version>2.0.0</version>
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
    implementation("dev.quicx:quicx-client:2.0.0")
}`}
              />
            ),
          },
        ]}
      />

      <Prose>
        <p>
          Java 11 or later, no dependencies. The client speaks QXP and works with Quicx 1.0.3
          and later; 2.0.0 was tested against quicxd 1.0.4 and 2.0.0.
        </p>
      </Prose>

      <SubHeading id="QuicxClient">QuicxClient — producers</SubHeading>

      <Prose>
        <p>
          A <InlineCode>QuicxClient</InlineCode> keeps one TCP connection to the daemon and
          uses it for every call; if the connection breaks, the next call opens a new one. One
          client can be shared by any number of threads, so create it once rather than once per
          task.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "new QuicxClient(host, port)",
            def: "A client with default timeouts. It connects on the first submit. QuicxClient.builder() sets the connect and response timeouts.",
          },
          {
            term: "int submit(type, payload)",
            def: (
              <>
                Sends <InlineCode>MSG_SUBMIT</InlineCode> and returns the task id once the
                daemon has queued the task. Does not wait for a worker. The payload is a{" "}
                <InlineCode>byte[]</InlineCode> or a <InlineCode>String</InlineCode> (sent as
                UTF-8).
              </>
            ),
          },
          {
            term: "TaskResult submitAndWait(type, payload, timeout)",
            def: (
              <>
                Submits and blocks until a worker reports <InlineCode>MSG_DONE</InlineCode> or{" "}
                <InlineCode>MSG_FAILED</InlineCode>, which the daemon passes back to the producer.{" "}
                <InlineCode>result.isFailed()</InlineCode> and{" "}
                <InlineCode>result.failureReason()</InlineCode> tell you how it ended.
              </>
            ),
          },
          {
            term: "CompletableFuture<TaskResult> submitAsync(type, payload)",
            def: "The same without blocking. Results are matched by task id, so they can arrive in any order.",
          },
          { term: "close()", def: "Closes the connection. Calls still waiting fail with QuicxConnectionException." },
        ]}
      />

      <CodeBlock
        filename="Producer.java"
        language="java"
        code={`import dev.quicx.QuicxClient;
import dev.quicx.QuicxRejectedException;
import dev.quicx.TaskResult;
import java.time.Duration;

try (QuicxClient client = new QuicxClient("localhost", 16381)) {
    int id = client.submit("send_email", "{\\"to\\":\\"ana@example.com\\"}");

    TaskResult result = client.submitAndWait("resize_image", imageBytes, Duration.ofSeconds(30));
    if (result.isFailed()) {
        System.err.println("resize failed: " + result.failureReason().get());
    }
} catch (QuicxRejectedException e) {
    if (e.isQueueFull()) {
        // the daemon's memory budget is full: try again later
    }
}`}
      />

      <SubHeading id="QuicxWorker">QuicxWorker — consumers</SubHeading>

      <Prose>
        <p>
          A <InlineCode>QuicxWorker</InlineCode> registers with{" "}
          <InlineCode>MSG_READY</InlineCode> and runs the tasks the daemon sends it, one at a
          time. When a handler returns, the worker replies <InlineCode>MSG_DONE</InlineCode>;
          when it throws, <InlineCode>MSG_FAILED</InlineCode> with the exception&rsquo;s class
          and message.
        </p>
      </Prose>

      <KeyList
        items={[
          { term: "new QuicxWorker(host, port)", def: "A worker with default settings. QuicxWorker.builder() sets the heartbeat interval and the reconnect delay." },
          { term: "handle(type, payload -> …)", def: "Runs the handler for every task of that type. Returns the worker, for chaining." },
          { term: "handleTask(type, task -> …)", def: "The same, for handlers that need the task's id or type (task.id(), task.type(), task.payload())." },
          { term: "fallback(task -> …)", def: "Runs tasks whose type has no handler. Without one, they are reported FAILED." },
          {
            term: "start() / startInBackground()",
            def: "Connects and runs tasks until stop(). start() blocks the calling thread; startInBackground() runs the same loop on a daemon thread.",
          },
          { term: "stop()", def: "Lets a running task finish and report its result, then disconnects and ends start()." },
        ]}
      />

      <CodeBlock
        filename="Worker.java"
        language="java"
        code={`import dev.quicx.QuicxWorker;
import java.nio.charset.StandardCharsets;

public class Worker {
    public static void main(String[] args) {
        QuicxWorker worker = new QuicxWorker("localhost", 16381)
            .handle("send_email", payload ->
                EmailService.deliver(new String(payload, StandardCharsets.UTF_8)))
            .handleTask("resize_image", task ->
                Images.resize(task.id(), task.payload()));

        Runtime.getRuntime().addShutdownHook(new Thread(worker::stop));
        worker.start();   // blocks until stop()
    }
}`}
      />

      <Callout variant="note" title="Staying connected">
        If the daemon restarts or the network drops, the worker reconnects by itself, waiting
        0.5 s after the first failure and up to 30 s after repeated ones. While idle it sends a{" "}
        <InlineCode>MSG_HEARTBEAT</InlineCode> every 5 s; if nothing comes back for three
        intervals, the connection is treated as dead. The worker logs through{" "}
        <InlineCode>System.Logger</InlineCode> as <InlineCode>dev.quicx.QuicxWorker</InlineCode>.
      </Callout>

      <SubHeading id="QuicxException">Errors and limits</SubHeading>

      <Prose>
        <p>
          Everything the library throws is unchecked and extends{" "}
          <InlineCode>QuicxException</InlineCode>:
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "QuicxRejectedException",
            def: (
              <>
                The daemon answered <InlineCode>MSG_ERROR</InlineCode>. <InlineCode>code()</InlineCode>{" "}
                gives the <InlineCode>ErrorCode</InlineCode>; <InlineCode>isQueueFull()</InlineCode>{" "}
                is true when the memory budget is full, and sending again later is the right
                reaction.
              </>
            ),
          },
          {
            term: "QuicxConnectionException",
            def: "The daemon could not be reached, or the connection broke before it answered. The task may or may not have been queued.",
          },
          {
            term: "IllegalArgumentException",
            def: "Thrown before sending when a task type or payload doesn't fit in a QXP frame.",
          },
        ]}
      />

      <Prose>
        <p>
          The limits come from QXP and are checked by the client: a task type is 1 to 31 bytes
          of UTF-8, a SUBMIT body (one length byte, the type, the payload) is at most 1,024
          bytes, and a failure reason is cut to 63 bytes. Delivery is at-most-once: if a
          worker dies mid-task, nothing is reported back, and a{" "}
          <InlineCode>submitAndWait</InlineCode> ends with its timeout.
        </p>
      </Prose>

      <Callout variant="note" title="Upgrading from 1.0">
        Most 1.0 code compiles unchanged. <InlineCode>submit</InlineCode> and{" "}
        <InlineCode>start</InlineCode> no longer declare <InlineCode>throws Exception</InlineCode>,
        so a <InlineCode>catch</InlineCode> for a specific checked exception around them can go.
        The worker now logs instead of printing to standard output.
      </Callout>
    </section>
  );
}
