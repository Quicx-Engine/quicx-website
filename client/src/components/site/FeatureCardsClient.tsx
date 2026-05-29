"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisualFor } from "./FeatureVisual";

export const ModalContext = createContext<((id: string | null) => void) | null>(
  null
);

export type ModalSlot = {
  id: string;
  modalTitle: string;
  shortSummary: string;
  body: ReactNode;
};

export function FeatureCardsInteractive({
  children,
  modalSlots,
}: {
  children: ReactNode;
  modalSlots: ModalSlot[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const currentSlot = modalSlots.find((s) => s.id === openId) ?? null;

  return (
    <ModalContext.Provider value={setOpenId}>
      {children}
      <Dialog
        open={openId !== null}
        onOpenChange={(o) => !o && setOpenId(null)}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "top-0 left-0 h-[100dvh] w-[100vw] max-w-none translate-x-0 translate-y-0",
            "gap-0 rounded-none border-0 bg-quicx-bg p-0 shadow-none",
            "sm:top-[50%] sm:left-[50%] sm:h-[min(92vh,900px)] sm:w-[min(92vw,1200px)] sm:max-w-[min(92vw,1200px)]",
            "sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded sm:border sm:border-quicx-line"
          )}
        >
          {currentSlot && (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-quicx-line px-6 py-4 sm:px-10">
                <span className="font-[family-name:var(--font-barlow-condensed)] text-xs uppercase tracking-[0.3em] text-quicx-dim">
                  Feature · {currentSlot.id}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  aria-label="Close"
                  className="inline-flex size-9 items-center justify-center rounded border border-quicx-line bg-white/[0.02] text-quicx-muted transition hover:border-white/20 hover:text-quicx-text"
                >
                  <XIconSmall className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">{currentSlot.body}</div>
            </div>
          )}
          {currentSlot && (
            <>
              <DialogTitle className="sr-only">
                {currentSlot.modalTitle}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {currentSlot.shortSummary}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

export function FeatureCardSlot({
  featureId,
  className,
  children,
}: {
  featureId: string;
  className?: string;
  children: ReactNode;
}) {
  const setOpenId = useContext(ModalContext);
  const [active, setActive] = useState(false);

  return (
    <button
      id={featureId}
      type="button"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={() => setOpenId?.(featureId)}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded border border-quicx-line bg-quicx-bg-2 text-left scroll-mt-24",
        "transition-all duration-500 ease-out",
        "hover:border-white/15 hover:bg-quicx-bg-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quicx-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-quicx-bg",
        className
      )}
    >
      {/* server-rendered chrome (title, expand icon, gradient overlays) */}
      {children}

      {/* Visual */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
        <div className="relative h-full">
          <VisualFor id={featureId} active={active} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-quicx-bg-2" />
      </div>
    </button>
  );
}

function XIconSmall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}
