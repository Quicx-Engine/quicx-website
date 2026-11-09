"use client";

import { useEffect, useState } from "react";
import { CURRENT_VERSION } from "@/lib/version";
import { Terminal, TerminalLine } from "./Terminal";
import { ConfigVisual } from "./visuals/ConfigVisual";
import { FootprintVisual } from "./visuals/FootprintVisual";
import { PerformanceVisual } from "./visuals/PerformanceVisual";
import { ProtocolVisual } from "./visuals/ProtocolVisual";
import { SetupVisual } from "./visuals/SetupVisual";

export function VisualFor({ id, active }: { id: string; active: boolean }) {
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
      return <ProtocolVisual active={active} />;
    case "setup":
      return <SetupVisual active={active} />;
    default:
      return null;
  }
}

/* ───────────────── terminal showcase ───────────────── */

// `quicx status` output as documented in the CLI reference, with each size's page
// count (the last column) left off so the lines fit the panel.
const statusSequence: TerminalLine[] = [
  { kind: "input", text: "quicx status" },
  { kind: "blank" },
  {
    kind: "output",
    text: `  quicx v${CURRENT_VERSION}  ·  pid 8278  ·  up 0h 0m 00s`,
    className: "text-quicx-text",
  },
  { kind: "blank" },
  { kind: "output", text: "  tasks     submitted       1,500" },
  { kind: "output", text: "            completed           0   ░░░░░░░░░░░░░░░░░░░░     0.0%" },
  { kind: "output", text: "            in flight       1,500   = 1500 queued + 0 running" },
  { kind: "blank" },
  {
    kind: "output",
    text: "  memory    32 / 508 pages          █░░░░░░░░░░░░░░░░░░░     6.3%",
    className: "text-quicx-text",
  },
  { kind: "output", text: "            pool 7.95 MiB, 16 KiB pages · 2 sizes in use" },
  { kind: "blank" },
  { kind: "output", text: "           176B    1,200 /   1,209  ███████████████████░    99.3%" },
  { kind: "output", text: "           976B      300 /     304  ███████████████████░    98.7%" },
];

function TerminalShowcase({ active }: { active: boolean }) {
  // The real `quicx status` screen is on the page from first paint;
  // when the stage comes into view the command is re-run once.
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (!active || ran) return;
    const t = setTimeout(() => setRan(true), 600);
    return () => clearTimeout(t);
  }, [active, ran]);

  return (
    <Terminal
      lines={ran ? [{ kind: "clear" }, ...statusSequence] : statusSequence}
      instant={ran ? 1 : statusSequence.length}
      typeSpeed={26}
      lineDelay={28}
    />
  );
}
