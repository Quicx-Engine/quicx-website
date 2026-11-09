"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DocsNavGroup } from "./DocsSidebar";
import { cn } from "@/lib/utils";

const idToSection: Record<string, string> = {
  "installation": "installation",
  "what-installer-does": "installation",
  "verify-installation": "installation",
  "quick-start": "quick-start",
  "configuration": "configuration",
  "server-block": "configuration",
  "memory-block": "configuration",
  "allocator-block": "configuration",
  "upgrading": "configuration",
  "architecture": "architecture",
  "single-daemon-design": "architecture",
  "allocator": "allocator",
  "allocator-architecture": "allocator",
  "allocator-features": "allocator",
  "allocator-benchmarks": "allocator",
  "allocator-tuning": "allocator",
  "binary-protocol": "binary-protocol",
  "protocol-frame-header": "binary-protocol",
  "protocol-message-types": "binary-protocol",
  "payload-formats": "binary-protocol",
  "benchmarks": "benchmarks",
  "reference-run": "benchmarks",
  "bench-throughput": "benchmarks",
  "bench-latency": "benchmarks",
  "bench-machines": "benchmarks",
  "bench-capacity": "benchmarks",
  "bench-memory": "benchmarks",
  "bench-footprint": "benchmarks",
  "bench-methodology": "benchmarks",
  "bench-comparison": "benchmarks",
  "limitations": "limitations",
  "not-implemented": "limitations",
  "feature-matrix": "limitations",
  "when-to-use": "limitations",
  "cli-reference": "cli-reference",
  "quicx-start": "cli-reference",
  "quicx-status": "cli-reference",
  "quicx-stop": "cli-reference",
  "java-client": "java-client",
  "java-build-setup": "java-client",
  "QuicxClient": "java-client",
  "QuicxWorker": "java-client",
  "QuicxException": "java-client",
  "changelog": "changelog",
};

// Deep search index mapping directly to IDs on the docs page
const searchIndex = [
  { id: "installation", label: "Installation", group: "Getting Started", breadcrumbs: "Getting Started → Installation", keywords: "download macos linux binary curl sh releases" },
  { id: "what-installer-does", label: "What the installer does", group: "Getting Started", breadcrumbs: "Getting Started → Installation", keywords: "usr local bin etc systemd service" },
  { id: "verify-installation", label: "Verify it worked", group: "Getting Started", breadcrumbs: "Getting Started → Installation", keywords: "quicx version which path" },
  { id: "quick-start", label: "Quick Start", group: "Getting Started", breadcrumbs: "Getting Started → Quick Start", keywords: "configure start status daemon first task worker" },
  { id: "configuration", label: "Configuration", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "quicx.conf etc path port host" },
  { id: "server-block", label: "[server] block", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "host port tcp" },
  { id: "memory-block", label: "[memory] block", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "pool_size budget memory limit mib" },
  { id: "allocator-block", label: "[allocator] block", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "reserve hardening purge fullest_first warm_pages reserve_pages apool" },
  { id: "upgrading", label: "Upgrading from 1.x", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "class lines pmad migrate old config" },
  { id: "architecture", label: "Architecture", group: "Core Concepts", breadcrumbs: "Core Concepts → Architecture", keywords: "single threaded event loop epoll kqueue tcp" },
  { id: "single-daemon-design", label: "Why a single daemon?", group: "Core Concepts", breadcrumbs: "Core Concepts → Architecture", keywords: "cpu core context switching scale out" },
  { id: "allocator", label: "apool Allocator", group: "Core Concepts", breadcrumbs: "Core Concepts → apool Allocator", keywords: "memory allocator adaptive pages slab pmad malloc free" },
  { id: "allocator-architecture", label: "Architecture", group: "Core Concepts", breadcrumbs: "Core Concepts → apool Allocator", keywords: "pages page records size classes free list bump mmap" },
  { id: "allocator-features", label: "Ideas from the literature", group: "Core Concepts", breadcrumbs: "Core Concepts → apool Allocator", keywords: "reserve hardening purge lifetime fullest hoard mimalloc jemalloc llama" },
  { id: "allocator-benchmarks", label: "Benchmarks", group: "Core Concepts", breadcrumbs: "Core Concepts → apool Allocator", keywords: "capacity ns per task pmad comparison ablation" },
  { id: "allocator-tuning", label: "Settings", group: "Core Concepts", breadcrumbs: "Core Concepts → apool Allocator", keywords: "page size warm pages reserve pages" },
  { id: "binary-protocol", label: "QXP Protocol", group: "Core Concepts", breadcrumbs: "Core Concepts → QXP Protocol", keywords: "qxp quicx protocol binary protocol tcp tcp/ip socket custom framing" },
  { id: "protocol-frame-header", label: "Frame header", group: "Core Concepts", breadcrumbs: "Core Concepts → QXP Protocol", keywords: "6 bytes opcode length wire format" },
  { id: "protocol-message-types", label: "Message types", group: "Core Concepts", breadcrumbs: "Core Concepts → QXP Protocol", keywords: "opcodes psh pop ack err" },
  { id: "payload-formats", label: "Payload formats", group: "Core Concepts", breadcrumbs: "Core Concepts → QXP Protocol", keywords: "ascii strings binary blob data format" },
  { id: "benchmarks", label: "Benchmarks", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "performance throughput tasks per second latency p50 p99 measured bench run.sh" },
  { id: "bench-throughput", label: "Throughput", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "81900 tasks sec closed loop single thread" },
  { id: "bench-latency", label: "Latency", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "51 us p50 p99 open loop coordinated omission submit done" },
  { id: "bench-machines", label: "Two machines", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "linux macos intel apple m4 i3 two machines" },
  { id: "bench-capacity", label: "Capacity", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "tasks fit 8 mib 46593 655 capacity" },
  { id: "bench-memory", label: "Memory", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "rss zero growth pool usage" },
  { id: "bench-methodology", label: "Methodology", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "how measured harness c clients reproduce" },
  { id: "bench-comparison", label: "Comparison", group: "Core Concepts", breadcrumbs: "Core Concepts → Benchmarks", keywords: "redis rabbitmq kafka beanstalkd versus" },
  { id: "limitations", label: "Limitations", group: "Core Concepts", breadcrumbs: "Core Concepts → Limitations", keywords: "persistence redelivery retries durability at most once tradeoffs" },
  { id: "not-implemented", label: "What Quicx does not do", group: "Core Concepts", breadcrumbs: "Core Concepts → Limitations", keywords: "missing features priorities delays named queues single core" },
  { id: "feature-matrix", label: "Feature for feature", group: "Core Concepts", breadcrumbs: "Core Concepts → Limitations", keywords: "compare beanstalkd redis streams rabbitmq matrix" },
  { id: "cli-reference", label: "CLI Reference", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "command line arguments" },
  { id: "quicx-start", label: "quicx start", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "run daemon server start" },
  { id: "quicx-status", label: "quicx status", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "monitor live ui terminal" },
  { id: "quicx-stop", label: "quicx stop", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "kill pid shutdown" },
  { id: "java-client", label: "Java Client", group: "Reference", breadcrumbs: "Reference → Java Client", keywords: "sdk library dependency dev.quicx" },
  { id: "java-build-setup", label: "Add it to your build", group: "Reference", breadcrumbs: "Reference → Java Client", keywords: "maven gradle pom.xml" },
  { id: "QuicxClient", label: "QuicxClient — producers", group: "Reference", breadcrumbs: "Reference → Java Client", keywords: "push messages enqueue" },
  { id: "QuicxWorker", label: "QuicxWorker — consumers", group: "Reference", breadcrumbs: "Reference → Java Client", keywords: "pop listen process block" },
  { id: "QuicxException", label: "QuicxException", group: "Reference", breadcrumbs: "Reference → Java Client", keywords: "error handling try catch" },
  { id: "changelog", label: "Changelog", group: "Reference", breadcrumbs: "Reference → Changelog", keywords: "updates versions releases history" },
];

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="rounded-[2px] bg-quicx-orange/25 px-0.5 text-quicx-text">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function DocsSearch({
  groups: _groups,
  onAfterNavigate,
}: {
  groups: DocsNavGroup[];
  onAfterNavigate?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [os, setOs] = useState<"mac" | "win" | "linux" | "unknown">("mac");

  useEffect(() => {
    const platform = window.navigator.platform?.toLowerCase() || "";
    const userAgent = window.navigator.userAgent?.toLowerCase() || "";

    if (platform.includes("mac") || userAgent.includes("mac")) {
      setOs("mac");
    } else if (platform.includes("win") || userAgent.includes("win")) {
      setOs("win");
    } else if (platform.includes("linux") || userAgent.includes("linux")) {
      setOs("linux");
    }
  }, []);

  const filteredItems = query
    ? searchIndex.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.keywords.toLowerCase().includes(query.toLowerCase()) ||
          i.group.toLowerCase().includes(query.toLowerCase())
      )
    : searchIndex;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onSelect = (id: string) => {
    setOpen(false);
    const sectionId = idToSection[id] ?? id;
    const href =
      sectionId === id ? `/docs/${sectionId}` : `/docs/${sectionId}#${id}`;
    router.push(href);
    onAfterNavigate?.();
  };

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      onSelect(filteredItems[selectedIndex].id);
    }
  };

  // Scroll active item into view without scrolling the whole page
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current && open) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const parent = listRef.current;
        const elTop = activeEl.offsetTop;
        const elBottom = elTop + activeEl.offsetHeight;
        const parentTop = parent.scrollTop;
        const parentBottom = parentTop + parent.offsetHeight;

        if (elTop < parentTop) {
          parent.scrollTop = elTop;
        } else if (elBottom > parentBottom) {
          parent.scrollTop = elBottom - parent.offsetHeight;
        }
      }
    }
  }, [selectedIndex, open]);

  return (
    <>
      {/* Trigger button — hide ⌘K badge on touch devices (no physical keyboard) */}
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="flex h-9 w-full items-center gap-2 rounded-[3px] border border-quicx-line-strong bg-quicx-well px-3 text-[14px] text-quicx-dim transition-colors hover:border-quicx-text/30 hover:text-quicx-body"
      >
        <Search className="size-4 opacity-70" />
        <span className="flex-1 truncate text-left">Search docs</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded-[2px] border border-quicx-line-strong px-1.5 font-mono text-[11px] text-quicx-dim sm:inline-flex">
          {os === "mac" ? (
            <><span className="text-xs">⌘</span>K</>
          ) : (
            <><span>Ctrl</span> K</>
          )}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        {/*
          Mobile: full-bleed (max-w-full, no rounded corners, no side borders),
          anchored just below the topbar, height capped with dvh so the
          software keyboard shrinking the viewport is accounted for.
          sm+: bounded width, rounded corners, full border.
        */}
        <DialogContent
          showCloseButton={false}
          className="top-[72px] flex max-h-[calc(100dvh-96px)] max-w-full translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-x-0 border-quicx-line-strong bg-quicx-well p-0 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] sm:max-w-2xl sm:rounded-[4px] sm:border-x"
        >
          <DialogTitle className="sr-only">Search Documentation</DialogTitle>

          {/* Search input row */}
          <div className="flex shrink-0 items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
            <Search className="size-5 shrink-0 text-quicx-muted" />
            <input
              autoFocus
              aria-label="Search docs"
              className="flex-1 bg-transparent text-[16px] text-quicx-text placeholder:text-quicx-dim focus-visible:outline-none"
              placeholder="Search docs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className="hidden h-6 select-none items-center rounded-[2px] border border-quicx-line-strong px-2 font-mono text-[11px] text-quicx-dim sm:inline-flex">
              ESC
            </kbd>
          </div>

          {/* Results area — grows to fill remaining dialog height */}
          <div className="flex flex-1 flex-col overflow-hidden border-t border-quicx-line">
            {/* Heading — hidden on mobile to save vertical space */}
            <div className="hidden shrink-0 px-5 pb-0 pt-5 sm:block">
              <h3 className="mb-3 caps-label text-quicx-dim">
                {query ? "Matches" : "All pages and sections"}
              </h3>
            </div>

            <div
              className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 pt-2 sm:px-3 sm:pb-4 sm:pt-0"
              ref={listRef}
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-quicx-dim sm:py-14">
                  No results for{" "}
                  <span className="font-medium text-quicx-text">&ldquo;{query}&rdquo;</span>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isActive = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => onSelect(item.id)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-[3px] px-3 py-2.5 transition-colors sm:gap-4 sm:px-4 sm:py-3",
                        isActive ? "bg-quicx-bg-3" : "hover:bg-white/[0.03]"
                      )}
                    >
                      <FileText className="size-4 shrink-0 text-quicx-dim sm:size-5" />

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-1 truncate text-[11px] font-medium text-quicx-dim sm:gap-1.5 sm:text-[12px]">
                          {item.breadcrumbs.split("→").map((crumb, idx, arr) => (
                            <React.Fragment key={idx}>
                              <span className="truncate">{crumb.trim()}</span>
                              {idx < arr.length - 1 && (
                                <span aria-hidden className="shrink-0 text-quicx-dim">/</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="mt-0.5 truncate text-[14px] font-medium text-quicx-text sm:text-[15px]">
                          <HighlightMatch text={item.label} query={query} />
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          "size-4 shrink-0 transition-all duration-200 sm:size-5",
                          isActive
                            ? "translate-x-0.5 text-quicx-orange-bright"
                            : "text-quicx-dim"
                        )}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
