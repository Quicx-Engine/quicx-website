import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  /** A terminal session: prompt lines are set apart from their output. */
  window?: boolean;
  copyable?: boolean;
  className?: string;
};

const PROMPT = /^(user@host[^$]*\$\s?)(.*)$/;

function ShellLines({ code, session }: { code: string; session: boolean }) {
  return (
    <>
      {code.split("\n").map((line, i) => {
        const m = line.match(PROMPT);
        if (m) {
          return (
            <span key={i} className="block">
              <span className="select-none text-quicx-dim">{m[1]}</span>
              <span className="text-quicx-text">{m[2]}</span>
            </span>
          );
        }
        if (line.trimStart().startsWith("#")) {
          return (
            <span key={i} className="block text-quicx-dim">
              {line || " "}
            </span>
          );
        }
        return (
          <span key={i} className={session ? "block text-quicx-muted" : "block text-quicx-text"}>
            {line || " "}
          </span>
        );
      })}
    </>
  );
}

/**
 * Code in the docs: a well a shade darker than the page, a hairline frame, and
 * a title strip naming the file or the shell. Terminal sessions dim the prompt
 * so the command reads first.
 */
export function CodeBlock({
  code,
  language,
  filename,
  window: isSession,
  copyable = true,
  className,
}: CodeBlockProps) {
  const label = filename ?? language ?? "";
  // A session's copy button copies the commands, not the transcript.
  const copyText = isSession
    ? code
        .split("\n")
        .map((l) => l.match(PROMPT)?.[2])
        .filter((l): l is string => Boolean(l && l.trim()))
        .join("\n") || code
    : code;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[3px] border border-quicx-line-strong bg-quicx-well",
        className
      )}
    >
      {(label || copyable) && (
        <div className="flex items-center justify-between gap-3 border-b border-quicx-line py-1.5 pl-4 pr-1.5">
          <span className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-quicx-dim">
            {isSession && <Terminal aria-hidden className="size-3.5 shrink-0 text-quicx-orange" />}
            <span className="truncate">{label}</span>
          </span>
          {copyable && <CopyButton code={copyText} />}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13.5px] leading-[1.7] text-quicx-text">
        <code>
          {isSession || language === "sh" ? (
            <ShellLines code={code} session={Boolean(isSession)} />
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}
