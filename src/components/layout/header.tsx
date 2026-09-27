"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Search,
  Store,
  X,
} from "lucide-react";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/products", label: "محصولات" },
  { href: "/compare", label: "مقایسه" },
  { href: "/vendor", label: "پنل فروشنده" },
  { href: "/vendor/orders", label: "سفارش‌ها" },
  { href: "/admin", label: "مدیریت" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_4px_16px_-4px_rgba(56,189,248,0.6)]">
            <Store className="h-4 w-4 text-white" />
            <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-md border-2 border-[var(--surface)] bg-gradient-to-br from-violet-500 to-fuchsia-400" />
          </span>
          <span className="font-display text-[16px] font-bold tracking-tight text-ink">
            ورتکس<span className="text-accent">یدک</span>
          </span>
        </Link>

        <nav className="mr-2 hidden items-center gap-1 lg:flex" aria-label="اصلی">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent-soft text-accent"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <form onSubmit={handleSearch} className="relative hidden w-56 md:block lg:w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی قطعه، برند یا خودرو..."
              aria-label="جستجو"
              className="h-10 w-full rounded-xl border border-edge bg-bg-soft pr-3.5 pl-10 text-[13px] text-ink transition-colors placeholder:text-ink-3 focus:border-accent/50 focus:bg-surface focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-accent"
              disabled={!query.trim()}
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </button>
            <SearchSuggestions
              query={query}
              onSelect={(text) => {
                setQuery(text);
                setMobileMenuOpen(false);
              }}
            />
          </form>

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-edge bg-surface-2 py-1.5 pr-2.5 pl-1.5 transition-colors hover:border-edge-strong"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-400 text-[11px] font-bold text-white">
                VY
              </span>
              <span className="hidden text-[13px] font-medium text-ink xl:block">
                حساب دمو
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-ink-3 transition-transform",
                  profileOpen && "rotate-180"
                )}
              />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-2xl border border-edge-strong bg-surface p-1.5 shadow-pop animate-rise"
              >
                <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-xs font-bold text-white">
                    VY
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      حساب دمو
                    </p>
                    <p className="text-[11px] text-ink-3">demo@vortexyadak.ir</p>
                  </div>
                </div>
                <div className="my-1 h-px bg-edge" />
                {[
                  { label: "پنل فروشنده", href: "/vendor", icon: Store },
                  { label: "مدیریت", href: "/admin", icon: LayoutDashboard },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-edge" />
                <p className="px-2.5 py-2 text-[11px] leading-relaxed text-ink-3">
                  حساب نمایشی — بدون ورود واقعی.
                </p>
              </div>
            )}
          </div>

          <Link
            href="/products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-surface-2 text-ink-2 transition-colors hover:text-ink md:hidden"
            aria-label="جستجو"
          >
            <Search className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-edge bg-surface-2 text-ink-2 transition-colors hover:text-ink lg:hidden"
            aria-label="منو"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-surface/95 backdrop-blur lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearch} className="relative mb-3 md:hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی قطعه..."
                aria-label="جستجو"
                className="h-10 w-full rounded-xl border border-edge bg-bg-soft pr-3.5 pl-10 text-[13px] text-ink placeholder:text-ink-3 focus:border-accent/50 focus:bg-surface focus:outline-none"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <SearchSuggestions query={query} onSelect={(text) => setQuery(text)} />
            </form>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent-soft text-accent"
                    : "text-ink hover:bg-surface-2"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
