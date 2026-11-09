import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * The architecture as a stacked flow: the same topology as the wide diagram,
 * set as text so it stays legible on a phone or inside the docs column.
 */
function Hop({ down, up }: { down: string; up: string }) {
  return (
    <div aria-hidden className="grid grid-cols-2 py-2 font-mono text-[12.5px]">
      <span className="flex items-center justify-end gap-2 pr-4 text-quicx-orange-bright">
        {down}
        <ArrowDown className="size-4 shrink-0" />
      </span>
      <span className="flex items-center gap-2 border-l border-quicx-line-strong pl-4 text-quicx-body">
        <ArrowUp className="size-4 shrink-0" />
        {up}
      </span>
    </div>
  );
}

function Group({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      className={
        accent
          ? "rounded-[3px] border border-quicx-orange/60 bg-quicx-orange/[0.04] px-4 py-4"
          : "rounded-[3px] border border-dashed border-quicx-line-strong px-4 py-4"
      }
    >
      <h3 className={`caps-label ${accent ? "text-quicx-orange-bright" : "text-quicx-muted"}`}>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li
          key={i}
          className="rounded-[3px] border border-quicx-line-strong bg-quicx-bg-2 px-3 py-2 text-[14px] text-quicx-text"
        >
          {i}
        </li>
      ))}
    </ul>
  );
}

const pipeline = ["Connection router", "Task queue", "Dispatcher", "Worker pool"];

export function ArchitectureFlow() {
  return (
    <div
      role="img"
      aria-label="Quicx architecture: producers send MSG_SUBMIT to the daemon and receive MSG_OK; inside the daemon a connection router feeds the task queue, the dispatcher and the worker pool, all allocating from apool, the page allocator inside the fixed budget; the worker pool sends MSG_TASK to workers, which reply MSG_DONE."
    >
      <Group title="Producers">
        <Chips items={["Producer A", "Producer B", "quicx status (CLI)"]} />
      </Group>

      <Hop down="MSG_SUBMIT" up="MSG_OK" />

      <Group title="Quicx daemon" accent>
        <ol className="space-y-1.5">
          {pipeline.map((step, i) => (
            <li key={step}>
              <div className="flex items-center gap-3 rounded-[3px] border border-quicx-line-strong bg-quicx-bg-2 px-3 py-2 text-[14px] text-quicx-text">
                <span
                  aria-hidden
                  className="flow-dot size-1.5 shrink-0 bg-quicx-orange"
                  style={{ "--i": i } as React.CSSProperties}
                />
                {step}
              </div>
              {i < pipeline.length - 1 && (
                <ArrowDown aria-hidden className="mx-auto mt-1.5 size-3.5 text-quicx-orange" />
              )}
            </li>
          ))}
        </ol>
        <div className="mt-4 border-t border-dashed border-quicx-line-strong pt-3">
          <p className="caps-label text-quicx-muted">apool allocator</p>
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-quicx-body">
            Every task above is one block from the fixed budget:{" "}
            <span className="font-mono text-[12.5px] text-quicx-text">O(1) alloc / free</span>, with
            pages going to the sizes that arrive.
          </p>
        </div>
      </Group>

      <Hop down="MSG_TASK" up="MSG_DONE" />

      <Group title="Workers">
        <Chips items={["Worker 1", "Worker 2", "Worker N"]} />
      </Group>
    </div>
  );
}
