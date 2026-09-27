"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchSuggestions } from "@/components/search/search-suggestions";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="glass border-b z-50 sticky top-0 bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:py-4 lg:px-8 py-3 flex items-center justify-between sm:flex-row flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-lg text-foreground hover:no-underline">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-amber-400 text-white text-xs font-black">V</span>
            ورتکس یدک
          </Link>
        </div>

        <div className="flex-1 max-w-xs relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors text-sm"
                placeholder="لنت 206"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-primary"
                disabled={!query.trim()}
                aria-label="جستجو"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
            <SearchSuggestions
              query={query}
              onSelect={(text) => setQuery(text)}
              className="w-full"
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/vendor" className="hidden sm:inline-block text-sm text-foreground hover:underline">
            فروشنده شوید
          </Link>
          <Link href="/admin" className="hidden sm:inline-block text-sm text-primary hover:underline">
            مدیریت
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-foreground hover:bg-accent"
            aria-label="منو"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t">
            <Link href="/vendor" className="block py-2 text-foreground hover:underline">فروشنده شوید</Link>
            <Link href="/admin" className="block py-2 text-primary hover:underline">مدیریت</Link>
          </div>
        )}
      </div>
    </header>
  );
}