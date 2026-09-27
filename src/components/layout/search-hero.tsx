"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchHero() {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          router.push(`/products?q=${encodeURIComponent(q.trim())}`);
        }
      }}
      className="relative w-full"
      role="search"
    >
      <div className="glass relative rounded-2xl p-1.5 shadow-pop">
        <Search className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="جستجوی قطعه"
          placeholder="مثلاً: لنت پژو 206 یا روغن سمند"
          className="h-12 w-full rounded-xl border border-transparent bg-transparent pr-11 pl-24 text-[15px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!q.trim()}
          className="absolute left-1.5 top-1.5 flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-accent to-cyan px-4 text-[13.5px] font-semibold text-white shadow-[0_4px_16px_-4px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-all enabled:hover:brightness-110 active:scale-[0.97] disabled:opacity-45"
        >
          <Search className="h-4 w-4" />
          جستجو
        </button>
      </div>
    </form>
  );
}
