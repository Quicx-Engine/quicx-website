"use client";

import React, { useEffect, useState, useRef } from "react";
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
  "allocator-block": "configuration",
  "tuning-rules": "configuration",
  "architecture": "architecture",
  "single-daemon-design": "architecture",
  "pmad-allocator": "pmad-allocator",
  "pmad-benchmarks": "pmad-allocator",
  "pmad-configurations": "pmad-allocator",
  "pmad-architecture": "pmad-allocator",
  "pmad-teardown": "pmad-allocator",
  "binary-protocol": "binary-protocol",
  "protocol-frame-header": "binary-protocol",
  "protocol-message-types": "binary-protocol",
  "payload-formats": "binary-protocol",
  "cli-reference": "cli-reference",
  "quicx-init": "cli-reference",
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
  { id: "verify-installation", label: "Verify it worked", group: "Getting Started", breadcrumbs: "Getting Started → Installation", keywords: "quicx -v version" },
  { id: "quick-start", label: "Quick Start", group: "Getting Started", breadcrumbs: "Getting Started → Quick Start", keywords: "init configure start status daemon" },
  { id: "configuration", label: "Configuration", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "quicx.conf etc path port host" },
  { id: "server-block", label: "[server] block", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "host port tcp" },
  { id: "allocator-block", label: "[allocator] block", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "slabs shape classes memory" },
  { id: "tuning-rules", label: "Tuning rules of thumb", group: "Getting Started", breadcrumbs: "Getting Started → Configuration", keywords: "small payloads shape tuning" },
  { id: "architecture", label: "Architecture", group: "Core Concepts", breadcrumbs: "Core Concepts → Architecture", keywords: "single threaded event loop epoll kqueue tcp" },
  { id: "single-daemon-design", label: "Why a single daemon?", group: "Core Concepts", breadcrumbs: "Core Concepts → Architecture", keywords: "cpu core context switching scale out" },
  { id: "pmad-allocator", label: "PMAD Allocator", group: "Core Concepts", breadcrumbs: "Core Concepts → PMAD Allocator", keywords: "memory fragmentation deterministic malloc free slabs" },
  { id: "pmad-benchmarks", label: "Benchmarks", group: "Core Concepts", breadcrumbs: "Core Concepts → PMAD Allocator", keywords: "performance ops sec latency malloc comparison" },
  { id: "pmad-configurations", label: "Reference configurations", group: "Core Concepts", breadcrumbs: "Core Concepts → PMAD Allocator", keywords: "slab shape size ram" },
  { id: "pmad-teardown", label: "Tear-down", group: "Core Concepts", breadcrumbs: "Core Concepts → PMAD Allocator", keywords: "shutdown memory unmap munmap free" },
  { id: "binary-protocol", label: "Binary Protocol", group: "Core Concepts", breadcrumbs: "Core Concepts → Binary Protocol", keywords: "tcp tcp/ip socket custom framing" },
  { id: "protocol-frame-header", label: "Frame header", group: "Core Concepts", breadcrumbs: "Core Concepts → Binary Protocol", keywords: "6 bytes opcode length wire format" },
  { id: "protocol-message-types", label: "Message types", group: "Core Concepts", breadcrumbs: "Core Concepts → Binary Protocol", keywords: "opcodes psh pop ack err" },
  { id: "payload-formats", label: "Payload formats", group: "Core Concepts", breadcrumbs: "Core Concepts → Binary Protocol", keywords: "ascii strings binary blob data format" },
  { id: "cli-reference", label: "CLI Reference", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "command line arguments" },
  { id: "quicx-init", label: "quicx init", group: "Reference", breadcrumbs: "Reference → CLI Reference", keywords: "generate config default" },
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
          <span key={i} className="rounded-[2px] bg-quicx-orange px-0.5 text-white">
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
  groups,
  onNavigateTo,
}: {
  groups: DocsNavGroup[];
  onNavigateTo?: (sectionId: string, elementId: string) => void;
}) {
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
    if (onNavigateTo) {
      const sectionId = idToSection[id] ?? id;
      onNavigateTo(sectionId, id);
    } else {
      window.location.hash = `#${id}`;
    }
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
      <button
        onClick={() => setOpen(true)}
        className="mb-6 flex w-full items-center gap-2 rounded-md border border-quicx-line bg-quicx-bg-2 px-3 py-2 text-sm text-quicx-muted shadow-sm transition hover:border-white/20 hover:text-quicx-text focus:outline-none focus:ring-2 focus:ring-quicx-orange/60"
      >
        <Search className="size-4 opacity-70" />
        <span className="flex-1 truncate text-left">Search documentation...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-quicx-line bg-quicx-bg px-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-medium opacity-100">
          {os === "mac" ? (
            <><span className="text-xs">⌘</span>K</>
          ) : (
            <><span className="text-[9px]">CTRL</span> K</>
          )}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[40%] max-w-3xl gap-0 overflow-hidden border border-quicx-line bg-[#061219] p-0 shadow-2xl sm:rounded-md"
        >
          <DialogTitle className="sr-only">Search Documentation</DialogTitle>
          
          <div className="flex items-center gap-3 px-5 py-4">
            <Search className="size-5 text-quicx-muted" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-[16px] text-quicx-text placeholder:text-quicx-dim focus:outline-none"
              placeholder="Search docs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <kbd className="hidden sm:inline-flex h-7 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-3 font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium text-quicx-dim transition hover:bg-white/10 hover:text-quicx-muted">
              ESC
            </kbd>
          </div>

          <div className="border-t border-quicx-line px-5 py-5">
            <h3 className="mb-4 text-[14px] font-semibold text-quicx-text">
              Welcome to Quicx Docs
            </h3>

            <div className="max-h-[520px] overflow-y-auto space-y-2 pb-2" ref={listRef}>
              {filteredItems.length === 0 ? (
                <div className="py-14 text-center text-sm text-quicx-dim">
                  No results found for <span className="text-quicx-text font-medium">"{query}"</span>
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
                        "group flex cursor-pointer items-center gap-4 rounded-md border px-4 py-4 transition-all",
                        isActive
                          ? "border-quicx-line bg-white/[0.04]"
                          : "border-transparent bg-white/[0.02] hover:border-quicx-line/50 hover:bg-white/[0.03]"
                      )}
                    >
                      <FileText className="size-5 shrink-0 text-quicx-dim" />
                      
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-quicx-dim">
                          {item.breadcrumbs.split('→').map((crumb, idx, arr) => (
                            <React.Fragment key={idx}>
                              <span>{crumb.trim()}</span>
                              {idx < arr.length - 1 && <span className="text-white/20">→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="mt-0.5 text-[15px] font-medium text-quicx-text">
                          <HighlightMatch text={item.label} query={query} />
                        </div>
                      </div>

                      <ChevronRight 
                        className={cn(
                          "size-5 transition-all duration-200", 
                          isActive ? "text-quicx-orange-bright translate-x-1" : "text-quicx-dim"
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
