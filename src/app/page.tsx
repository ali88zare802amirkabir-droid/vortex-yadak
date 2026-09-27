import { getVehicles, getProducts, getVendors } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { VendorCard } from "@/components/vendor/vendor-card";
import { SearchHero } from "@/components/layout/search-hero";
import Link from "next/link";

export default async function HomePage() {
  const vehicles = await getVehicles();
  const products = await getProducts();
  const topProducts = products.slice(0, 12);
  const vendors = await getVendors();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-50 via-white to-amber-50 dark:from-sky-900/20 dark:via-gray-900 dark:to-amber-900/20">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 lg:px-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex rounded-full bg-sky-100 text-sky-700 px-4 py-1 text-sm font-medium dark:bg-sky-900/40 dark:text-sky-300">
            نمونه‌ساز — Demo
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
            قطعه مورد نیاز خودروت را{" "}
            <span className="text-gradient">سریع پیدا کن</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            اتصال مستقیم خریدار به فروشندگان قطعات یدکی. پیدا کردن قطعه مناسب، مشاهده موجودی و دریافت حضوری.
          </p>

          <SearchHero />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              پیدا کردن قطعه مناسب
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              مشاهده موجودی لحظه‌ای
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              دریافت حضوری
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategoryGrid />

      {/* Popular cars */}
      <PopularVehicles vehicles={vehicles} />

      {/* Top products */}
      <section className="space-y-4">
        <SectionHeader title="محصولات پرطرفدار" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Top vendors */}
      <section className="space-y-4">
        <SectionHeader title="فروشگاه‌های برتر" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <Benefits />
    </div>
  );
}

function CategoryGrid() {
  const cats = [
    { name: "موتور", icon: "⚙️" },
    { name: "ترمز", icon: "🛞" },
    { name: "برق", icon: "🔋" },
    { name: "بدنه", icon: "🚗" },
    { name: "جلوبندی", icon: "🛞" },
    { name: "مصرفی", icon: "🧴" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cats.map((c) => (
        <Link key={c.name} href={`/products?category=${c.name}`} className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-card-hover hover:border-sky-300 transition-all">
          <div className="text-3xl mb-2 text-center">{c.icon}</div>
          <h3 className="text-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
        </Link>
      ))}
    </div>
  );
}

import type { Vehicle } from "@/lib/db/types";

function PopularVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const popular = vehicles.slice(0, 6);
  return (
    <section className="space-y-4">
      <SectionHeader title="خودروهای محبوب" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {popular.map((v) => (
          <Link key={v.id} href={`/products?vehicle=${encodeURIComponent(`${v.brand} ${v.model}`)}`} className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-card-hover hover:border-sky-300 transition-all text-center">
            <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{v.brand}</div>
            <div className="text-xs text-muted-foreground">{v.model} ({v.year})</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { title: "پیدا کردن قطعه مناسب", desc: "جستجوی هوشمند بر اساس خودرو، دسته‌بندی و برند" },
    { title: "مشاهده موجودی", desc: "اطمینان از وجود قطعه قبل از مراجعه" },
    { title: "دریافت حضوری", desc: "مکانیزه شما را نزدیک‌ترین فروشگاه یدکی" },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}