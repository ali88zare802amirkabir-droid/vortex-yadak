"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }
>(function Input({ className, label, hint, error, id, ...props }, ref) {
  const input = (
    <input
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      className={cn(
        "h-11 w-full rounded-xl border border-edge bg-bg-soft px-3.5 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-accent/50 focus:bg-surface focus:outline-none",
        error && "border-danger/50",
        className
      )}
      {...props}
    />
  );

  if (!label) {
    return (
      <>
        {input}
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </>
    );
  }

  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      {input}
      {error ? (
        <span className="block text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="block text-xs text-ink-3">{hint}</span>
      )}
    </label>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-edge bg-bg-soft px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-accent/50 focus:bg-surface focus:outline-none",
        className
      )}
      {...props}
    />
  );
});

export const NativeSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function NativeSelect({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full appearance-none rounded-xl border border-edge bg-bg-soft px-3.5 text-sm text-ink transition-colors focus:border-accent/50 focus:bg-surface focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-medium text-ink-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}
