"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/db/types";
import { cn } from "@/lib/utils";

type SearchResult = { query: string; items: SearchSuggestion[] };

export function SearchSuggestions({ query, onSelect, className }: { query: string; onSelect: (text: string) => void; className?: string }) {
  const [result, setResult] = useState<SearchResult | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResult({ query: trimmed, items: data.suggestions ?? [] });
      } catch {
        if (!controller.signal.aborted) {
          setResult({ query: trimmed, items: [] });
        }
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  if (!trimmed) return null;

  const settled = result?.query === trimmed;
  const items = settled ? result.items : [];
  const loading = !settled;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-[calc(100%+8px)] right-0 z-50 w-full overflow-hidden rounded-2xl border border-edge-strong bg-surface p-1.5 shadow-pop animate-rise",
        className
      )}
    >
      {loading && (
        <div className="px-3 py-2.5 text-[13px] text-ink-3">در حال جستجو...</div>
      )}
      {!loading && items.length === 0 && (
        <div className="px-3 py-2.5 text-[13px] text-ink-3">نتیجه‌ای یافت نشد</div>
      )}
      {items.map((s) => (
        <button
          key={s.text}
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-right text-[13px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          onClick={() => {
            onSelect(s.text);
            router.push(`/products?q=${encodeURIComponent(s.text)}`);
          }}
        >
          <span className="shrink-0 rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold text-ink-3">
            {s.type === "product" ? "محصول" : s.type === "category" ? "دسته" : "خودرو"}
          </span>
          <span className="truncate">{s.text}</span>
        </button>
      ))}
    </div>
  );
}
