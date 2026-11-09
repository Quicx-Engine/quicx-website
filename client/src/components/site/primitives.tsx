import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}

/**
 * The landing page's section opener: a condensed display statement, finished
 * by a sentence in the reading face, with the section's argument set beside it.
 */
export function SectionHead({
  id,
  title,
  continuation,
  children,
  tone = "default",
}: {
  id?: string;
  title: string;
  continuation?: string;
  children?: React.ReactNode;
  tone?: "default" | "onOrange";
}) {
  const onOrange = tone === "onOrange";
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
      <h2 id={id} className="lg:col-span-7">
        <span
          className={cn(
            "display block text-[clamp(2.75rem,6.4vw,5.5rem)]",
            onOrange ? "text-quicx-on-orange" : "text-quicx-text"
          )}
        >
          {title}
        </span>
        {continuation && (
          <span
            className={cn(
              "mt-4 block text-balance text-[clamp(1.375rem,2.3vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.01em]",
              onOrange ? "text-quicx-on-orange/75" : "text-quicx-muted"
            )}
          >
            {continuation}
          </span>
        )}
      </h2>
      {children && (
        <div
          className={cn(
            "max-w-[46ch] text-[16px] leading-[1.65] lg:col-span-5 lg:justify-self-end lg:pb-1.5",
            onOrange ? "text-quicx-on-orange/80" : "text-quicx-muted"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ink" | "inkOutline";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-quicx-orange text-quicx-on-orange hover:bg-quicx-orange-bright active:bg-quicx-orange-deep",
  secondary:
    "border border-quicx-line-strong text-quicx-text hover:border-quicx-text/45 hover:bg-white/[0.03]",
  ink: "bg-quicx-on-orange text-quicx-text hover:bg-[#13262f]",
  inkOutline:
    "border border-quicx-on-orange/35 text-quicx-on-orange hover:border-quicx-on-orange hover:bg-quicx-on-orange/[0.06]",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const classes = cn(
    "group inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] font-control transition-colors duration-200",
    size === "sm" ? "h-9 px-3.5 text-[12.5px]" : "h-12 px-5 text-[14px]",
    buttonVariants[variant],
    className
  );
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden
      className={cn(
        "size-4 transition-transform duration-200 group-hover:translate-x-0.5",
        className
      )}
    />
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-control text-[13.5px] text-quicx-orange-bright transition-colors hover:text-quicx-text",
        className
      )}
    >
      {children}
      <ArrowGlyph />
    </Link>
  );
}
