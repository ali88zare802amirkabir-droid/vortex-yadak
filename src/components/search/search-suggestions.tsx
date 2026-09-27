// eslint-disable-next-line react-hooks/set-state-in-effect
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchSuggestion } from "@/lib/db/types";

export function SearchSuggestions({ query, onSelect, className }: { query: string; onSelect: (text: string) => void; className?: string }) {
  const [items, setItems] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // close handled externally via open state
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!query || query.length < 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      return;
    }
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeout(() => {
      setLoading(true);
    }, 0);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setItems(data.suggestions || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) return null;

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