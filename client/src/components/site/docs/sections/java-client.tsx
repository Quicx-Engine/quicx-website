import Link from "next/link";
import { CodeBlock } from "@/components/site/docs/CodeBlock";
import { Callout } from "@/components/site/docs/Callout";
import { Tabs } from "@/components/site/docs/Tabs";
import {
  SectionHeaderFor,
  Prose,
  InlineCode,
  SubHeading,
  KeyList,
  Table,
} from "@/components/site/docs/_primitives";

export function JavaClientSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="java-client" />

      <Prose>
        <p>
          This page is the reference for the library: how to add it to a build, which daemon
          versions it works with, every public method of <InlineCode>QuicxClient</InlineCode> and{" "}
          <InlineCode>QuicxWorker</InlineCode>, the threads it runs and the errors it throws. To
          see a producer and a worker run first, follow{" "}
          <Link href="/docs/quick-start">the quick start, a first task queue in Java</Link>. The
          Javadoc is on{" "}
          <a href="https://javadoc.io/doc/dev.quicx/quicx-client">javadoc.io</a> and the source is{" "}
          <a href="https://github.com/Quicx-Engine/Quicx-Java">Quicx-Engine/Quicx-Java</a> on
          GitHub, MIT licensed.
        </p>
      </Prose>

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
  <version>2.1.0</version>
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
    implementation("dev.quicx:quicx-client:2.1.0")
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
    implementation 'dev.quicx:quicx-client:2.1.0'
}`}
              />
            ),
          },
        ]}
      />

      <Prose>
        <p>
          The artifact is on{" "}
          <a href="https://central.sonatype.com/artifact/dev.quicx/quicx-client">Maven Central</a>,
          so no extra repository is needed. The jar is about 30 KB and has no dependencies of its
          own. On the module path its name is <InlineCode>dev.quicx.client</InlineCode>:
        </p>
      </Prose>

      <CodeBlock
        filename="module-info.java"
        language="java"
        code={`module com.example.orders {
    requires dev.quicx.client;
}`}
      />

      <SubHeading id="java-compatibility">Compatibility</SubHeading>

      <Table
        headers={["", "quicxd 1.0.3 to 2.0.x", "quicxd 2.1.0 and later"]}
        rows={[
          ["submit, results, workers", "yes", "yes"],
          [
            <>value levels and <InlineCode>isEvicted()</InlineCode></>,
            <>refused with <InlineCode>INVALID_MESSAGE</InlineCode></>,
            "yes",
          ],
          [
            <><InlineCode>maxBody</InlineCode> above 1,024 bytes</>,
            "no",
            <>with a daemon built with <InlineCode>make MAX_PAYLOAD=N</InlineCode></>,
          ],
        ]}
      />

      <Prose>
        <p>
          Java 11 or later. Client 2.1.0 was tested against quicxd 2.0.0 and 2.1.0, on Java 11,
          17 and 21. Code written for client 2.0 compiles and behaves the same with 2.1. A daemon
          is installed with one command, see <Link href="/docs/installation">Installation</Link>;{" "}
          <InlineCode>quicx version</InlineCode> tells you which one is running.
        </p>
      </Prose>

      <SubHeading id="QuicxClient">QuicxClient for producers</SubHeading>

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
            def: "A client with default settings. It connects on the first submit.",
          },
          {
            term: "QuicxClient.builder()",
            def: (
              <>
                Settings, each with its default: <InlineCode>host</InlineCode> (localhost),{" "}
                <InlineCode>port</InlineCode> (16381), <InlineCode>connectTimeout</InlineCode> (5
                s), <InlineCode>responseTimeout</InlineCode> (10 s, how long a submit waits for the
                daemon to accept the task) and <InlineCode>maxBody</InlineCode> (1,024 bytes, only
                to be raised for a daemon built with <InlineCode>make MAX_PAYLOAD=N</InlineCode>).{" "}
                <InlineCode>build()</InlineCode> returns the client.
              </>
            ),
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
            term: "int submit(type, payload, level)",
            def: (
              <>
                Sends <InlineCode>MSG_SUBMIT_VALUED</InlineCode> with a value level from 0 to 15
                (quicxd 2.1.0 and later). Higher levels reach workers first, and when the budget is
                full a task can push out a waiting task of a lower level.{" "}
                <InlineCode>QuicxClient.DEFAULT_LEVEL</InlineCode> (8) is what a plain submit gets;{" "}
                <InlineCode>QuicxClient.CRITICAL_LEVEL</InlineCode> (15) is never evicted.
              </>
            ),
          },
          {
            term: "TaskResult submitAndWait(type, payload, [level,] timeout)",
            def: (
              <>
                Submits and blocks until a worker reports <InlineCode>MSG_DONE</InlineCode> or{" "}
                <InlineCode>MSG_FAILED</InlineCode>, which the daemon passes back to the producer,
                or until the daemon evicts the task. Throws <InlineCode>QuicxException</InlineCode>{" "}
                if no result arrives within <InlineCode>timeout</InlineCode>.
              </>
            ),
          },
          {
            term: "CompletableFuture<TaskResult> submitAsync(type, payload, [level])",
            def: "The same without blocking. Results are matched by task id, so they can arrive in any order. If the daemon refuses the task, the future fails with QuicxRejectedException.",
          },
          {
            term: "host(), port(), maxBody()",
            def: "The settings the client was built with.",
          },
          {
            term: "DEFAULT_PORT, DEFAULT_LEVEL, CRITICAL_LEVEL",
            def: "16381, 8 and 15.",
          },
          {
            term: "close()",
            def: "Closes the connection. Calls still waiting fail with QuicxConnectionException. Calling it twice does nothing.",
          },
        ]}
      />

      <Prose>
        <p>
          A <InlineCode>TaskResult</InlineCode> says how a task ended:{" "}
          <InlineCode>taskId()</InlineCode>, <InlineCode>isDone()</InlineCode>,{" "}
          <InlineCode>isFailed()</InlineCode>, <InlineCode>isEvicted()</InlineCode> and{" "}
          <InlineCode>failureReason()</InlineCode>, an <InlineCode>Optional&lt;String&gt;</InlineCode>{" "}
          with the worker&rsquo;s reason (at most 63 bytes). An evicted task also counts as
          failed, with the reason <InlineCode>evicted</InlineCode>, so check{" "}
          <InlineCode>isEvicted()</InlineCode> first: an evicted task never ran.
        </p>
      </Prose>

      <CodeBlock
        filename="Producer.java"
        language="java"
        code={`import dev.quicx.QuicxClient;
import dev.quicx.TaskResult;
import java.time.Duration;

QuicxClient client = QuicxClient.builder()
    .host("queue.internal")
    .connectTimeout(Duration.ofSeconds(2))
    .responseTimeout(Duration.ofSeconds(5))
    .build();

int id = client.submit("send_email", "{\\"to\\":\\"ana@example.com\\"}");

// quicxd 2.1+: a frame worth keeping, and a command that is never evicted
client.submit("frame", "/cam/0/000124.jpg", 12);
client.submit("stop", "", QuicxClient.CRITICAL_LEVEL);

TaskResult result = client.submitAndWait("resize_image", imageBytes, Duration.ofSeconds(30));
if (result.isFailed()) {
    System.err.println("resize failed: " + result.failureReason().get());
}

// an ordinary frame: find out later whether a more valuable task pushed it out
client.submitAsync("frame", "/cam/0/000125.jpg", 4).thenAccept(r -> {
    if (r.isEvicted()) retryLater("/cam/0/000125.jpg");
});`}
      />

      <SubHeading id="QuicxWorker">QuicxWorker for consumers</SubHeading>

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
          { term: "new QuicxWorker(host, port)", def: "A worker with default settings." },
          {
            term: "QuicxWorker.builder()",
            def: (
              <>
                <InlineCode>host</InlineCode>, <InlineCode>port</InlineCode>,{" "}
                <InlineCode>connectTimeout</InlineCode> (5 s),{" "}
                <InlineCode>heartbeatInterval</InlineCode> (5 s) and{" "}
                <InlineCode>reconnectDelay(min, max)</InlineCode> (0.5 s and 30 s).
              </>
            ),
          },
          { term: "handle(type, payload -> …)", def: "Runs the handler for every task of that type. Registering a type again replaces its handler. Returns the worker, for chaining." },
          { term: "handleTask(type, task -> …)", def: "The same, for handlers that need the whole Task: id(), type(), payload() (a copy), payloadAsString() (UTF-8) and payloadLength()." },
          { term: "fallback(task -> …)", def: "Runs tasks whose type has no handler. Without one, they are reported FAILED with the reason \"no handler for task type …\"." },
          {
            term: "start() / startInBackground()",
            def: "Connects and runs tasks until stop(). start() blocks the calling thread; startInBackground() runs the same loop on a new daemon thread and returns it. A worker starts once: a second start() throws IllegalStateException, so create a new worker to start again.",
          },
          { term: "stop() / close()", def: "Lets a running task finish and report its result, then disconnects and ends start(). Safe to call from any thread." },
          { term: "isRunning(), tasksDone(), tasksFailed()", def: "Whether the worker is running, and the tasks it has reported DONE and FAILED since it started." },
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
        <InlineCode>System.Logger</InlineCode> as <InlineCode>dev.quicx.QuicxWorker</InlineCode>,
        so its messages reach java.util.logging by default, or SLF4J and Log4j through their{" "}
        <InlineCode>System.Logger</InlineCode> bridges.
      </Callout>

      <SubHeading id="java-threading">Threading model</SubHeading>

      <Prose>
        <p>
          <strong>QuicxClient</strong> is safe to share between threads. Calls write their
          frames one at a time on the client&rsquo;s single connection, and a background daemon
          thread named <InlineCode>quicx-client host:port</InlineCode> reads the daemon&rsquo;s
          answers and hands each one to the call waiting for it. <InlineCode>submit()</InlineCode>{" "}
          blocks its caller until the daemon has accepted the task,{" "}
          <InlineCode>submitAndWait()</InlineCode> until the result or the timeout, and{" "}
          <InlineCode>submitAsync()</InlineCode> returns at once.
        </p>
        <p>
          The futures from <InlineCode>submitAsync()</InlineCode> are completed on that reader
          thread, so a callback attached with <InlineCode>thenAccept</InlineCode> or{" "}
          <InlineCode>thenApply</InlineCode> before the result arrives runs there too. A slow
          callback holds up every other answer for the same client. Keep callbacks short, or pass
          your own executor with <InlineCode>thenAcceptAsync(callback, executor)</InlineCode>.
        </p>
        <p>
          <strong>QuicxWorker</strong> runs one task at a time, on the thread that called{" "}
          <InlineCode>start()</InlineCode>, or on the thread{" "}
          <InlineCode>startInBackground()</InlineCode> creates, named{" "}
          <InlineCode>quicx-worker host:port</InlineCode>. A second thread per connection only
          sends heartbeats. To run tasks in parallel, run several workers, in one process or in
          several: each has its own connection, and the daemon gives every task to one idle
          worker. A handler shared by several workers is called from several threads, so it has
          to be thread-safe.
        </p>
      </Prose>

      <CodeBlock
        filename="Workers.java"
        language="java"
        code={`// four workers, four connections, up to four tasks at a time
static QuicxWorker newWorker() {
    return new QuicxWorker("localhost", 16381)
        .handleTask("resize_image", task -> Images.resize(task.id(), task.payload()));
}

public static void main(String[] args) {
    for (int i = 0; i < 3; i++) newWorker().startInBackground();
    newWorker().start();   // the fourth keeps main alive
}`}
      />

      <SubHeading id="QuicxException">Error handling</SubHeading>

      <Prose>
        <p>
          Everything the library throws is unchecked and extends{" "}
          <InlineCode>QuicxException</InlineCode>, so the compiler never forces a{" "}
          <InlineCode>catch</InlineCode>; catch what you can act on:
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "QuicxRejectedException",
            def: (
              <>
                The daemon answered <InlineCode>MSG_ERROR</InlineCode>, for example{" "}
                <InlineCode>quicxd refused: out of memory (QUEUE_FULL)</InlineCode>.{" "}
                <InlineCode>code()</InlineCode> gives the <InlineCode>ErrorCode</InlineCode> and{" "}
                <InlineCode>reason()</InlineCode> the daemon&rsquo;s text.{" "}
                <InlineCode>isQueueFull()</InlineCode> is true when the memory budget is full and
                nothing less valuable could be evicted; sending again later, or with a higher
                level, is the right reaction.
              </>
            ),
          },
          {
            term: "QuicxConnectionException",
            def: "The daemon could not be reached, or the connection broke before it answered. The task may or may not have been queued.",
          },
          {
            term: "QuicxException",
            def: "On its own: submitAndWait() got no result within its timeout (\"no result within 5000 ms\"), or the waiting thread was interrupted. The task is not cancelled; it stays queued until a worker runs it.",
          },
          {
            term: "IllegalArgumentException",
            def: "Thrown before sending when a task type, payload or level does not fit in a QXP frame (see the limits below).",
          },
        ]}
      />

      <Table
        headers={["code", "ErrorCode", "meaning"]}
        rows={[
          ["0x01", "QUEUE_FULL", "The memory budget is full. In answer to a worker's READY: the worker pool is full, and the worker retries after its reconnect delay."],
          ["0x02", "INVALID_MESSAGE", "The frame could not be parsed. Also a level above 15, or a valued submit sent to quicxd older than 2.1."],
          ["0x03", "PAYLOAD_TOO_BIG", "The body is larger than the daemon accepts: 1,024 bytes unless it was built with a larger MAX_PAYLOAD."],
          ["0x04", "UNKNOWN_TYPE", "A message type the daemon does not know."],
          ["0x05", "VERSION_MISMATCH", "The client and the daemon speak different QXP versions."],
          ["", "UNKNOWN", "A code this version of the client does not know."],
        ]}
      />

      <Prose>
        <p>
          A full budget is the error a producer should expect and handle. Back off and try again,
          and stop after a while so a producer cannot spin forever against a daemon with no
          workers:
        </p>
      </Prose>

      <CodeBlock
        filename="Retry.java"
        language="java"
        code={`static int submitWithRetry(QuicxClient client, String type, String payload, int level)
        throws InterruptedException {
    long wait = 50;
    while (true) {
        try {
            return client.submit(type, payload, level);
        } catch (QuicxRejectedException e) {
            if (!e.isQueueFull() || wait > 5_000) throw e;   // not a full budget, or waited enough
        }
        Thread.sleep(wait);
        wait *= 2;
    }
}`}
      />

      <Prose>
        <p>
          Do not retry a <InlineCode>QuicxConnectionException</InlineCode> the same way unless
          the task is safe to run twice: the first attempt may have been queued before the
          connection broke.
        </p>
      </Prose>

      <SubHeading id="java-limits">Limits and delivery</SubHeading>

      <Prose>
        <p>
          The limits come from QXP and are checked by the client before anything is sent: a task
          type is 1 to 31 bytes of UTF-8; a submit body (one length byte, the type, the payload,
          and one more byte for the level in a valued submit) is at most 1,024 bytes, so a plain
          submit with a 10-byte type has room for 1,013 bytes of payload; a level is 0 to 15; and a failure
          reason is cut to 63 bytes at a character boundary. A daemon built with{" "}
          <InlineCode>make MAX_PAYLOAD=N</InlineCode> takes bodies up to N (at most 16,320); set{" "}
          <InlineCode>maxBody(N)</InlineCode> on the client to match.
        </p>
        <p>
          Delivery is at-most-once. The daemon frees a task as soon as it hands it to a worker,
          so if that worker dies mid-task, nothing is reported back and a{" "}
          <InlineCode>submitAndWait</InlineCode> ends with its timeout. For large data, put the
          data where your workers can read it and send its path or id as the payload. What else
          Quicx leaves out is listed in <Link href="/docs/limitations">Limitations</Link>.
        </p>
      </Prose>

      <Callout variant="note" title="Upgrading from 1.0">
        Most 1.0 code compiles unchanged. <InlineCode>submit</InlineCode> and{" "}
        <InlineCode>start</InlineCode> no longer declare <InlineCode>throws Exception</InlineCode>,
        so a <InlineCode>catch</InlineCode> for a specific checked exception around them can go.
        The client now keeps one connection open, so it also receives results, and the worker
        logs instead of printing to standard output.
      </Callout>
    </section>
  );
}
