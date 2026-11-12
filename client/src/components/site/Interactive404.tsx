"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "./primitives";
import { Panel } from "./visuals/Panel";

const destinations = [
  { href: "/", label: "Home", note: "What Quicx is and what it measured" },
  { href: "/docs/quick-start", label: "Quick start", note: "From install to a first task" },
  { href: "/docs/installation", label: "Documentation", note: "Every section, from the top" },
];

export function Interactive404() {
  const pathname = usePathname() || "/";
  const command = `curl -sI https://quicx.dev${pathname}`;
  const [typed, setTyped] = useState("");
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => {
        setTyped(command);
        setAnswered(true);
      }, 0);
      return () => clearTimeout(t);
    }
    let i = 0;
    let answerTimer: ReturnType<typeof setTimeout> | undefined;
    const typer = setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));
      if (i >= command.length) {
        clearInterval(typer);
        answerTimer = setTimeout(() => setAnswered(true), 350);
      }
    }, 28);
    return () => {
      clearInterval(typer);
      if (answerTimer) clearTimeout(answerTimer);
    };
  }, [command]);

  return (
    <Container className="py-20 lg:py-28">
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <h1 className="display text-[clamp(3.5rem,9vw,7.5rem)] text-quicx-text">
            No such route.
          </h1>
          <p className="mt-6 max-w-[40ch] text-[18px] leading-[1.6] text-quicx-body">
            Nothing is queued at this address. It may have moved, or the link that brought you
            here was wrong.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="h-[168px] overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well">
            <Panel title="zsh" className="h-full">
              <div className="px-4 py-3.5 font-mono text-[13px] leading-[1.7]">
                <div className="break-all text-quicx-text">
                  <span className="text-quicx-dim">user@host ~ $</span> {typed}
                  {!answered && (
                    <span
                      aria-hidden
                      data-loop className="caret-blink ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[3px] bg-quicx-orange"
                    />
                  )}
                </div>
                <div className={answered ? "opacity-100" : "opacity-0"} aria-live="polite">
                  <div className="text-quicx-orange-bright">HTTP/2 404</div>
                  <div className="text-quicx-muted">content-type: text/html; charset=utf-8</div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      <nav aria-label="Where to go instead" className="mt-16 border-t border-quicx-line-strong">
        <ul className="grid grid-cols-1 md:grid-cols-3">
          {destinations.map((d, i) => (
            <li key={d.href} className={i > 0 ? "border-t border-quicx-line md:border-l md:border-t-0" : ""}>
              <Link
                href={d.href}
                className="group flex h-full items-start justify-between gap-4 py-6 transition-colors hover:bg-white/[0.02] md:px-6 md:first:pl-0"
              >
                <span>
                  <span className="block text-[18px] font-semibold text-quicx-text">{d.label}</span>
                  <span className="mt-1 block text-[14.5px] text-quicx-muted">{d.note}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-quicx-orange transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
