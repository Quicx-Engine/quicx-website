import React from "react";
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

// Every output on this page is from a real run of these files, in this order,
// against quicxd 2.1.0 and quicx-client 2.1.0 on macOS.

function Step({
  id,
  index,
  title,
  children,
}: {
  id: string;
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
        <h3
          id={id}
          className="scroll-mt-24 text-[22px] font-semibold leading-tight tracking-[-0.01em] text-quicx-text"
        >
          <span className="sr-only">Step {index}: </span>
          {title}
        </h3>
        {children}
      </div>
    </li>
  );
}

const CLIENT_JAR = "quicx-client-2.1.0.jar";
const RUN = `java -cp ${CLIENT_JAR}`;

export function QuickStartSection() {
  return (
    <section className="space-y-8">
      <SectionHeaderFor slug="quick-start" />

      <Prose>
        <p>
          You need the <InlineCode>quicx</InlineCode> binary and Java 11 or later.{" "}
          <Link href="/docs/installation">Installing Quicx</Link> is one command, and{" "}
          <InlineCode>quicx version</InlineCode> should then print{" "}
          <InlineCode>quicx v{CURRENT_VERSION}</InlineCode>. Each program below is a single file
          that <InlineCode>java</InlineCode> runs straight from source, so the client jar on the
          classpath is the only setup. In a Maven or Gradle project, take the dependency from{" "}
          <Link href="/docs/java-client#java-build-setup">the Java client&rsquo;s build setup</Link>{" "}
          instead and run the same classes.
        </p>
        <p>
          You will use three terminals in one empty directory: one for the daemon, one for a
          worker and one for the producers.
        </p>
      </Prose>

      <ol className="space-y-10">
        <Step id="qs-daemon" index="01" title="Start the daemon with a memory budget">
          <Prose>
            <p>
              Create a two-line <InlineCode>quicx.conf</InlineCode>. The budget is tiny on
              purpose, so that a later step can fill it in under a second; the default is 8 MiB.
            </p>
          </Prose>
          <CodeBlock
            filename="quicx.conf"
            language="conf"
            code={`[memory]
pool_size = 256K`}
          />
          <Prose>
            <p>
              Start the daemon in the first terminal. It stays in the foreground and prints what it
              is running with:
            </p>
          </Prose>
          <CodeBlock
            window
            filename="terminal 1: the daemon"
            language="sh"
            code={`user@host qs $ quicx start --config quicx.conf
config loaded: quicx.conf
quicx v${CURRENT_VERSION} starting
  port:    16381
  pool:    262144 bytes, 16 KiB pages given to block sizes on demand
  apool:   reserve, hardening, purge; when full: value
  pages:   12 for tasks (4 kept warm, 0 reserved), 3 for connections and workers
quicx listening on port 16381 [kqueue]
quicx cli socket: /tmp/quicx.sock`}
          />
          <Prose>
            <p>
              256 KiB is 16 pages of 16 KiB: three hold connections and workers, one holds the
              records that describe the pages, and twelve hold tasks. The daemon maps all of it
              once, at startup, and never asks the OS for more. <InlineCode>when full: value</InlineCode>{" "}
              is the default admission rule: when the budget is full, a new task may push out a
              waiting task of a lower value level. On Linux the event loop reads{" "}
              <InlineCode>[epoll]</InlineCode> instead of <InlineCode>[kqueue]</InlineCode>.
            </p>
          </Prose>
        </Step>

        <Step id="qs-client" index="02" title="Get the Java client">
          <Prose>
            <p>
              The client, <InlineCode>dev.quicx:quicx-client</InlineCode>, is one 30 KB jar with
              no dependencies. Download it from Maven Central into the same directory:
            </p>
          </Prose>
          <CodeBlock
            window
            filename="terminal 3"
            language="sh"
            code={`user@host qs $ curl -fsSLO https://repo1.maven.org/maven2/dev/quicx/quicx-client/2.1.0/${CLIENT_JAR}`}
          />
        </Step>

        <Step id="qs-worker" index="03" title="Run a worker">
          <Prose>
            <p>
              A worker connects, tells the daemon which task types it handles, and runs tasks one
              at a time. This one prints every task it runs. <InlineCode>handleTask</InlineCode>{" "}
              gives the handler the whole task, including the id the daemon gave it;
              when the handler returns, the worker reports the task done.
            </p>
          </Prose>
          <CodeBlock
            filename="Worker.java"
            language="java"
            code={`import dev.quicx.QuicxWorker;

public class Worker {
    public static void main(String[] args) {
        QuicxWorker worker = new QuicxWorker("localhost", 16381)
            .handleTask("invoice", task ->
                System.out.println("ran invoice   #" + task.id() + " " + task.payloadAsString()))
            .handleTask("thumbnail", task ->
                System.out.println("ran thumbnail #" + task.id() + " " + task.payloadAsString()));

        Runtime.getRuntime().addShutdownHook(new Thread(worker::stop));
        worker.start();   // blocks until Ctrl-C
    }
}`}
          />
          <Prose>
            <p>Run it in the second terminal and leave it running:</p>
          </Prose>
          <CodeBlock
            window
            filename="terminal 2: the worker"
            language="sh"
            code={`user@host qs $ ${RUN} Worker.java
Nov 20, 2026 12:17:50 AM dev.quicx.QuicxWorker start
INFO: connected to quicxd at localhost:16381, handling [invoice, thumbnail]`}
          />
          <Prose>
            <p>
              The <InlineCode>INFO</InlineCode> line is the worker&rsquo;s own log. It goes through{" "}
              <InlineCode>System.Logger</InlineCode>, so in an application it ends up wherever the
              rest of your logging goes.
            </p>
          </Prose>
        </Step>

        <Step id="qs-producer" index="04" title="Submit tasks with value levels">
          <Prose>
            <p>
              Every task carries a value level from 0, the least valuable, to 15, which is never
              evicted. A submit without a level gets 8. Waiting tasks with a higher level reach
              workers first, and when the budget is full the level decides what is kept. This
              producer queues a thumbnail at level 2 and an invoice at level 12, then submits a
              second invoice and waits until a worker has run it.
            </p>
          </Prose>
          <CodeBlock
            filename="Producer.java"
            language="java"
            code={`import dev.quicx.QuicxClient;
import dev.quicx.TaskResult;
import java.time.Duration;

public class Producer {
    public static void main(String[] args) {
        try (QuicxClient client = new QuicxClient("localhost", 16381)) {
            // value levels: 0 (least valuable) to 15 (never evicted); a plain submit is 8
            int thumb = client.submit("thumbnail", "photos/cat.jpg", 2);
            int inv = client.submit("invoice", "order-1001", 12);
            System.out.println("queued thumbnail #" + thumb + " and invoice #" + inv);

            // wait until a worker has run it
            TaskResult r = client.submitAndWait("invoice", "order-1002", 12, Duration.ofSeconds(5));
            System.out.println("invoice #" + r.taskId() + (r.isDone() ? " done" : " failed: " + r.failureReason().get()));
        }
    }
}`}
          />
          <CodeBlock
            window
            filename="terminal 3: the producer"
            language="sh"
            code={`user@host qs $ ${RUN} Producer.java
queued thumbnail #1 and invoice #2
invoice #3 done`}
          />
          <Prose>
            <p>At the same moment, the worker prints:</p>
          </Prose>
          <CodeBlock
            window
            filename="terminal 2: the worker"
            language="sh"
            code={`ran thumbnail #1 photos/cat.jpg
ran invoice   #2 order-1001
ran invoice   #3 order-1002`}
          />
          <Prose>
            <p>
              With a worker idle, each task goes to it as soon as it arrives, so they run in the
              order they were sent. Levels only change the order of tasks that are waiting, which
              is what the next part shows.
            </p>
          </Prose>
        </Step>
      </ol>

      <Callout variant="perf" title="What happened on the wire">
        The producer opened one TCP connection and used it for all three calls. Each submit was a{" "}
        <InlineCode>MSG_SUBMIT_VALUED</InlineCode> frame, a 6-byte header followed by the level,
        the task type and the payload, and the daemon answered <InlineCode>MSG_OK</InlineCode>{" "}
        with the task id that <InlineCode>submit()</InlineCode> returns. The daemon pushed each
        task to the idle worker as <InlineCode>MSG_TASK</InlineCode>; the worker answered{" "}
        <InlineCode>MSG_DONE</InlineCode>, and the daemon passed that{" "}
        <InlineCode>MSG_DONE</InlineCode> back to the producer&rsquo;s connection, which is how{" "}
        <InlineCode>submitAndWait()</InlineCode> knew the second invoice had run. Every frame is
        specified in <Link href="/docs/binary-protocol">QXP, the Quicx Protocol</Link>.
      </Callout>

      <SubHeading id="qs-budget-full">When the budget is full</SubHeading>

      <Prose>
        <p>
          Stop the worker with Ctrl-C, so that nothing takes tasks off the queue, and run the
          producer below. It fills the budget with level-2 thumbnails until the daemon refuses
          one, then sends a level-12 invoice. It keeps the result of its very first thumbnail, to
          show what became of it.
        </p>
      </Prose>

      <CodeBlock
        filename="Flood.java"
        language="java"
        code={`import dev.quicx.QuicxClient;
import dev.quicx.QuicxRejectedException;
import dev.quicx.TaskResult;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class Flood {
    public static void main(String[] args) throws Exception {
        try (QuicxClient client = new QuicxClient("localhost", 16381)) {
            // keep the result of the oldest thumbnail, to see what happens to it
            CompletableFuture<TaskResult> first = client.submitAsync("thumbnail", "img-0", 2);

            // fill the budget with level-2 thumbnails; no worker is running
            int queued = 1;
            try {
                while (true) {
                    client.submit("thumbnail", "img-" + queued, 2);
                    queued++;
                }
            } catch (QuicxRejectedException e) {
                System.out.println("budget full after " + queued + " thumbnails: " + e.code());
            }

            // a more valuable task still gets in: it evicts the oldest thumbnail
            int id = client.submit("invoice", "order-1003", 12);
            System.out.println("invoice accepted as #" + id);

            TaskResult r = first.get(5, TimeUnit.SECONDS);
            System.out.println("thumbnail #" + r.taskId() + " evicted: " + r.isEvicted());

            // another thumbnail has nothing less valuable to push out
            try {
                client.submit("thumbnail", "img-late", 2);
            } catch (QuicxRejectedException e) {
                System.out.println("late thumbnail refused: " + e.code());
            }
        }
    }
}`}
      />

      <CodeBlock
        window
        filename="terminal 3: the producer"
        language="sh"
        code={`user@host qs $ ${RUN} Flood.java
budget full after 2448 thumbnails: QUEUE_FULL
invoice accepted as #2452
thumbnail #4 evicted: true
late thumbnail refused: QUEUE_FULL
user@host qs $ quicx status

  quicx v${CURRENT_VERSION}  ·  pid 30155  ·  up 0h 0m 08s

  tasks     submitted       2,452
            completed           3   ░░░░░░░░░░░░░░░░░░░░     0.1%
            failed              0                            0.0%
            evicted             1                            0.0%   for more valuable tasks
            in flight       2,448   = 2448 queued + 0 running
            queued          2,448
  ...
  memory    12 / 12 pages           ████████████████████   100.0%
            pool 207.9 KiB, 16 KiB pages · 1 size in use

            80B    2,448 /   2,448  ████████████████████   100.0%    12 pages`}
      />

      <Prose>
        <p>
          Each thumbnail takes an 80-byte block: a 64-byte record plus its payload, rounded up to
          16 bytes. A 16 KiB page holds 204 of those, so the twelve task pages hold exactly 2,448,
          and the next thumbnail was refused with <InlineCode>QUEUE_FULL</InlineCode>.{" "}
          <Link href="/docs/configuration#capacity">How many tasks fit</Link> has the formula for
          any payload and budget.
        </p>
        <p>
          When the invoice arrived, the budget was full, so the daemon evicted the oldest waiting
          task with the lowest level below 12: thumbnail #4, the first one Flood sent (#1 to #3
          were the earlier producer&rsquo;s). Its producer was told through the task&rsquo;s
          result, where <InlineCode>isEvicted()</InlineCode> is true. An evicted task never ran;
          send it again later if it still matters. The late thumbnail was refused because no
          waiting task had a lower level than its own: tasks of the same level never evict each
          other. That is also why a queue fed only plain submits, which are all level 8, simply
          refuses new tasks once it is full.
        </p>
        <p>
          Eviction needs one more condition: the freed memory has to fit the new task, which
          means the same block size, or the last block on its page. Here every task is an 80-byte
          block. Start the worker again, and the invoice, the last task to arrive, runs first:
        </p>
      </Prose>

      <CodeBlock
        window
        filename="terminal 2: the worker"
        language="sh"
        code={`user@host qs $ ${RUN} Worker.java
Nov 20, 2026 12:17:57 AM dev.quicx.QuicxWorker start
INFO: connected to quicxd at localhost:16381, handling [invoice, thumbnail]
ran invoice   #2452 order-1003
ran thumbnail #5 img-1
ran thumbnail #6 img-2
...
ran thumbnail #2451 img-2447`}
      />

      <Prose>
        <p>
          The same rule at scale, on the real daemon under overload, is measured in{" "}
          <Link href="/docs/benchmarks#when-full">Benchmarks: when the budget is full</Link>.
        </p>
      </Prose>

      <SubHeading id="qs-errors">Common errors and how to fix them</SubHeading>

      <Prose>
        <p>
          Each entry is the message as the daemon prints it, or as the client puts it in the
          exception.
        </p>
      </Prose>

      <KeyList
        items={[
          {
            term: "cannot connect to quicxd at localhost:16381",
            def: (
              <>
                A <InlineCode>QuicxConnectionException</InlineCode>: no daemon listens on that
                host and port. Start it with <InlineCode>quicx start</InlineCode>, or give the
                client and the worker the port it uses.
              </>
            ),
          },
          {
            term: "bind: Address already in use",
            def: (
              <>
                From <InlineCode>quicx start</InlineCode>: another daemon already has port 16381.
                Stop that one with Ctrl-C in its terminal, or start this one with{" "}
                <InlineCode>--port 16401</InlineCode> and use that port in the Java code. See{" "}
                <Link href="/docs/cli-reference#several-daemons">several daemons on one machine</Link>.
              </>
            ),
          },
          {
            term: "error: quicx.conf:2: pool_size must be a byte count such as 8388608 or 8M, not '8MB'",
            def: (
              <>
                The config is checked strictly and names the file and line. Sizes take{" "}
                <InlineCode>K</InlineCode>, <InlineCode>M</InlineCode> or{" "}
                <InlineCode>G</InlineCode> (1024-based); <InlineCode>8MB</InlineCode> is refused as
                ambiguous.
              </>
            ),
          },
          {
            term: "quicxd refused: out of memory (QUEUE_FULL)",
            def: (
              <>
                A <InlineCode>QuicxRejectedException</InlineCode> whose{" "}
                <InlineCode>isQueueFull()</InlineCode> is true: the budget is full and nothing
                waiting has a lower level than the new task. Run more workers, send it again
                later, give it a higher level, or raise <InlineCode>pool_size</InlineCode>.
              </>
            ),
          },
          {
            term: "quicxd refused: parse error (INVALID_MESSAGE)",
            def: (
              <>
                A submit with a level reached a daemon older than 2.1.0, which does not know{" "}
                <InlineCode>MSG_SUBMIT_VALUED</InlineCode>. The usual cause is an old{" "}
                <InlineCode>quicx</InlineCode> earlier on the <InlineCode>PATH</InlineCode>: check{" "}
                <InlineCode>quicx version</InlineCode> and run the installer again.
              </>
            ),
          },
          {
            term: "payload of 2000 bytes is too large: with the task type 'thumbnail' at most 1014 bytes fit in one QXP frame of 1024 bytes",
            def: (
              <>
                An <InlineCode>IllegalArgumentException</InlineCode>, thrown before anything is
                sent. Put large data where the workers can read it and send its path or id, as the
                examples here do. Bigger tasks need a daemon built for them; see{" "}
                <Link href="/docs/java-client#java-limits">the Java client&rsquo;s limits</Link>.
              </>
            ),
          },
          {
            term: "no result within 5000 ms",
            def: (
              <>
                A <InlineCode>QuicxException</InlineCode> from{" "}
                <InlineCode>submitAndWait</InlineCode>: no worker ran the task in time, usually
                because none is running. The timeout only ends the waiting. The task stays queued
                and runs when a worker connects.
              </>
            ),
          },
          {
            term: "no handler for task type resize",
            def: (
              <>
                The failure reason of a task that reached a worker without a handler for its
                type; <InlineCode>failureReason()</InlineCode> returns it, and the worker logs it
                as a warning. Register the exact type with <InlineCode>handle</InlineCode> or{" "}
                <InlineCode>handleTask</InlineCode>, or set a <InlineCode>fallback</InlineCode>.
              </>
            ),
          },
        ]}
      />

      <SubHeading id="qs-next">Next steps</SubHeading>

      <Prose>
        <p>
          Stop the daemon with Ctrl-C, or <InlineCode>quicx stop</InlineCode> from another
          terminal. Tasks still queued are lost when it stops: Quicx keeps them in memory only.
          From here:
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-quicx-dim">
          <li>
            <Link href="/docs/java-client">Java client API reference</Link>: every method of{" "}
            <InlineCode>QuicxClient</InlineCode> and <InlineCode>QuicxWorker</InlineCode>, the
            threading model, error handling and the Maven and Gradle coordinates.
          </li>
          <li>
            <Link href="/docs/configuration">Configuration</Link>: the memory budget, the
            admission rule and how many tasks a budget holds.
          </li>
          <li>
            <Link href="/docs/cli-reference">CLI reference</Link>:{" "}
            <InlineCode>quicx status</InlineCode>, <InlineCode>quicx stop</InlineCode> and running
            several daemons on one machine.
          </li>
          <li>
            <Link href="/docs/benchmarks">Benchmarks</Link>: throughput, latency, capacity and
            value-aware eviction under overload, all measured.
          </li>
          <li>
            <Link href="/docs/limitations">Limitations</Link>: no persistence, at-most-once
            delivery, and everything else Quicx deliberately does not do.
          </li>
          <li>
            <Link href="/docs/binary-protocol">QXP protocol</Link>: the frames behind every call
            above, enough to write a client in another language.
          </li>
        </ul>
      </Prose>
    </section>
  );
}
