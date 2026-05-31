"use client";

import { useEffect, useState } from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { Terminal, TerminalLine } from "./Terminal";
import { ConfigVisual } from "./visuals/ConfigVisual";
import { FootprintVisual } from "./visuals/FootprintVisual";
import { PerformanceVisual } from "./visuals/PerformanceVisual";
import { ProtocolVisual } from "./visuals/ProtocolVisual";
import { SetupVisual } from "./visuals/SetupVisual";

export function VisualFor({
  id,
  active,
  expanded,
}: {
  id: string;
  active: boolean;
  expanded?: boolean;
}) {
  switch (id) {
    case "observability":
      return <TerminalShowcase active={active} />;
    case "configurability":
      return <ConfigVisual active={active} />;
    case "lightweight":
      return <FootprintVisual active={active} />;
    case "performance":
      return <PerformanceVisual active={active} />;
    case "protocol":
      return <ProtocolVisual active={active} expanded={expanded} />;
    case "setup":
      return <SetupVisual active={active} />;
    default:
      return null;
  }
}

/* ───────────────── terminal showcase ───────────────── */

const initialUsageSequence: TerminalLine[] = [
  { kind: "input", text: "quicx" },
  { kind: "output", text: `quicx v${CURRENT_VERSION} — lightweight task queue daemon` },
  { kind: "blank" },
  { kind: "output", text: "usage:" },
  { kind: "output", text: "  quicx start --config FILE" },
  { kind: "output", text: "  quicx stop" },
  { kind: "output", text: "  quicx status" },
  { kind: "output", text: "  quicx version" },
];

const usageSequence: TerminalLine[] = [
  { kind: "input", text: "clear" },
  { kind: "clear" },
  ...initialUsageSequence,
];

const statusSequence: TerminalLine[] = [
  { kind: "input", text: "clear" },
  { kind: "clear" },
  { kind: "input", text: "quicx status" },
  { kind: "blank" },
  { kind: "output", text: `  quicx v${CURRENT_VERSION}`, className: "text-quicx-text" },
  { kind: "output", text: "  ─────────────────────────────────────────", className: "text-quicx-dim" },
  { kind: "output", text: "  uptime     0h 0m 7s" },
  { kind: "blank" },
  { kind: "output", text: "  workers    idle: 0     busy: 0     total: 0" },
  { kind: "output", text: "  queue      waiting: 0" },
  { kind: "blank" },
  { kind: "output", text: "  tasks      submitted: 0" },
  { kind: "output", text: "             completed: 0" },
  { kind: "output", text: "             failed:    0" },
  { kind: "blank" },
  { kind: "output", text: "  memory     32 / 913408 bytes (0.0%)" },
  { kind: "blank" },
  { kind: "output", text: "  PMAD:", className: "text-quicx-orange-bright" },
  { kind: "output", text: "      32B  [░░░░░░░░░░░░░░░░░░░░]  1 / 2184" },
  { kind: "output", text: "      64B  [░░░░░░░░░░░░░░░░░░░░]  0 / 3276" },
  { kind: "output", text: "     128B  [░░░░░░░░░░░░░░░░░░░░]  0 / 1820" },
  { kind: "output", text: "     256B  [░░░░░░░░░░░░░░░░░░░░]  0 /  770" },
  { kind: "output", text: "     512B  [░░░░░░░░░░░░░░░░░░░░]  0 /  238" },
  { kind: "output", text: "    1024B  [░░░░░░░░░░░░░░░░░░░░]  0 /   80" },
];

function TerminalShowcase({ active }: { active: boolean }) {
  const [hasHovered, setHasHovered] = useState(false);

  useEffect(() => {
    if (active) setHasHovered(true);
  }, [active]);

  const currentLines = active
    ? statusSequence
    : hasHovered
      ? usageSequence
      : initialUsageSequence;

  return (
    <div className="h-full p-5">
      <Terminal
        lines={currentLines}
        active={true}
        typeSpeed={22}
        lineDelay={35}
      />
    </div>
  );
}
