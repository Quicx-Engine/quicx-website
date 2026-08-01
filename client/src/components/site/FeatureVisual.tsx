"use client";

import { useEffect, useState } from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";
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
      return <TerminalShowcase active={active} expanded={expanded} />;
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
  { kind: "output", text: `  quicx v${CURRENT_VERSION}  ·  pid 3709  ·  up 0h 0m 02s`, className: "text-quicx-text" },
  { kind: "blank" },
  { kind: "output", text: "  tasks     submitted           0" },
  { kind: "output", text: "            completed           0   ░░░░░░░░░░░░░░░░░░░░     0.0%" },
  { kind: "output", text: "            in flight           0   = 0 queued + 0 running" },
  { kind: "blank" },
  { kind: "output", text: "  memory    592.8 KiB / 8.00 MiB    █░░░░░░░░░░░░░░░░░░░     7.2%" },
  { kind: "output", text: "            usable 8.00 MiB · 64 size classes" },
  { kind: "blank" },
  { kind: "output", text: "            16B        1 /   5,241  ░░░░░░░░░░░░░░░░░░░░     0.0%" },
  { kind: "output", text: "            64B        0 /  12,580  ░░░░░░░░░░░░░░░░░░░░     0.0%" },
  { kind: "output", text: "            ...        (62 more size classes)" },
];

function TerminalShowcase({
  active,
  expanded,
}: {
  active: boolean;
  expanded?: boolean;
}) {
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
    <div className={cn("p-5", expanded ? "h-[600px]" : "h-full")}>
      <Terminal
        lines={currentLines}
        active={true}
        typeSpeed={22}
        lineDelay={35}
      />
    </div>
  );
}
