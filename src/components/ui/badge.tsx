import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "ok"
  | "warn"
  | "danger"
  | "info"
  | "accent"
  | "muted"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive";

const tones: Record<BadgeTone, string> = {
  ok: "bg-ok-soft text-ok border-ok/20",
  success: "bg-ok-soft text-ok border-ok/20",
  warn: "bg-warn-soft text-warn border-warn/20",
  warning: "bg-warn-soft text-warn border-warn/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  destructive: "bg-danger-soft text-danger border-danger/20",
  info: "bg-info-soft text-info border-info/20",
  accent: "bg-accent-soft text-accent border-accent/20",
  muted: "bg-surface-3 text-ink-2 border-edge",
  secondary: "bg-surface-3 text-ink-2 border-edge",
  outline: "bg-transparent text-ink-2 border-edge-strong",
};

export function Badge({
  children,
  tone = "muted",
  variant,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        tones[tone ?? variant ?? "muted"],
        className
      )}
    >
      {children}
    </span>
  );
}
