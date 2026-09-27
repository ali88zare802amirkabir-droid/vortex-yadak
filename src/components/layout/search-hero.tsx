"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchHero() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          setQ(q.trim());
          router.push(`/products?q=${encodeURIComponent(q.trim())}`);
        }
      }}
      className="relative w-full max-w-xl"
    >
      <div className="relative group">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-full border border-input bg-background/80 backdrop-blur-sm px-5 py-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-card"
          placeholder="مثلاً: لنت پژو 206 یا روغن سمند"
        />
        <button
          type="submit"
          disabled={!q.trim()}
          className="absolute right-1.5 top-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-amber-400 text-white shadow-lg disabled:opacity-50"
        >
          <svg className="mx-auto h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>
    </form>
  );
}