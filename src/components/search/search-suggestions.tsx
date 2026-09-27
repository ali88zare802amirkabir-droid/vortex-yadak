"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/db/types";

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
    <div ref={ref} className={`absolute top-full mt-2 w-full rounded-lg border bg-popover shadow-lg shadow-black/5 z-50 py-1 ${className || ''}`}>
      {loading && <div className="px-3 py-2 text-xs text-muted-foreground">در حال جستجو...</div>}
      {!loading && items.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">نتیجه‌ای یافت نشد</div>}
      {items.map((s) => (
        <button
          key={s.text}
          type="button"
          className="w-full text-right px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
          onClick={() => {
            onSelect(s.text);
            router.push(`/products?q=${encodeURIComponent(s.text)}`);
          }}
        >
          <span className="text-muted-foreground text-xs">{s.type === "product" ? "محصول" : s.type === "category" ? "دسته" : "خودرو"}</span>
          {s.text}
        </button>
      ))}
    </div>
  );
}
