import Link from "next/link";
import {
  Battery,
  Disc,
  Droplets,
  Gauge,
  PackageCheck,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getVehicles, getProducts, getVendors } from "@/lib/db";
import type { Vehicle } from "@/lib/db/types";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { VendorCard } from "@/components/vendor/vendor-card";
import { SearchHero } from "@/components/layout/search-hero";

const CATEGORIES: { name: string; icon: LucideIcon }[] = [
  { name: "موتور", icon: Settings2 },
  { name: "ترمز", icon: Disc },
  { name: "برق", icon: Battery },
  { name: "بدنه", icon: Gauge },
  { name: "جلوبندی", icon: Gauge },
  { name: "مصرفی", icon: Droplets },
];

export default async function HomePage() {
  const vehicles = await getVehicles();
  const products = await getProducts();
  const vendors = await getVendors();
  const topProducts = products.slice(0, 12);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-b from-surface-2/70 via-card to-card">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />

        <div className="relative flex flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1.5 text-[12px] font-semibold text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            نسونه‌ساز — محیط دمو
          </span>

          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-[56px]">
            قطعه مورد نیاز خودروت را
            <span className="bg-gradient-to-l from-accent to-cyan bg-clip-text text-transparent">
              {" "}
              سریع پیدا کن
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">
            اتصال مستقیم خریدار به فروشندگان قطعات یدکی. قطعه مناسب خودروت را پیدا کن،
            موجودی را ببین و حضوری دریافت کن.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <SearchHero />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-ink-2">
            {["انتخاب خودرو", "استعلام موجودی", "دریافت حضوری"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ok" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "محصول ثبت‌شده", value: products.length },
          { label: "فروشگاه فعال", value: vendors.length },
          { label: "خودروی پشتیبانی‌شده", value: vehicles.length },
          { label: "دسته‌بندی تخصصی", value: CATEGORIES.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-edge bg-card px-4 py-4 text-center"
          >
            <p className="font-display text-2xl font-bold text-ink">
              {stat.value.toLocaleString("fa-IR")}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-3">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <SectionHeader
          title="دسته‌بندی قطعات"
          description="قطعه مورد نیازت را از دسته‌های تخصصی انتخاب کن."
          action={
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors hover:text-cyan"
            >
              همه محصولات
              <Search className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-edge bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-edge-strong bg-surface-2 transition-colors group-hover:border-accent/30 group-hover:text-accent">
                <c.icon className="h-5 w-5 text-ink-2 transition-colors group-hover:text-accent" />
              </span>
              <span className="text-[13px] font-semibold text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <PopularVehicles vehicles={vehicles} />

      <section className="space-y-5">
        <SectionHeader
          title="محصولات پرطرفدار"
          description="پرفروش‌ترین قطعات موجود در فروشگاه‌های فعال."
          action={
            <Link
              href="/products"
              className="text-[13px] font-semibold text-accent transition-colors hover:text-cyan"
            >
              مشاهده همه
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader title="فروشگاه‌های برتر" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "پیدا کردن قطعه مناسب",
            desc: "جستجوی هوشمند بر اساس خودرو، دسته‌بندی و برند.",
            icon: Search,
          },
          {
            title: "مشاهده موجودی",
            desc: "قبل از مراجعه از موجود بودن قطعه مطمئن شو.",
            icon: PackageCheck,
          },
          {
            title: "دریافت حضوری",
            desc: "قطعه را از نزدیک‌ترین فروشگاه یدکی تحویل بگیر.",
            icon: Store,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-edge bg-card p-6 transition-colors hover:border-edge-strong"
          >
            <span className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft">
              <item.icon className="h-5 w-5 text-accent" />
            </span>
            <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-l from-accent/12 via-card to-transparent p-8 sm:p-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              فروشنده قطعات یدکی هستی؟
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-2">
              محصولاتت را ثبت کن، سفارش‌ها را مدیریت کن و به هزاران خریدار قطعه دسترسی داشته
              باش.
            </p>
          </div>
          <Link
            href="/vendor"
            className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-b from-accent to-cyan px-6 text-[14px] font-semibold text-white shadow-[0_4px_16px_-4px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-all hover:brightness-110 active:scale-[0.97]"
          >
            <Zap className="h-4 w-4" />
            ثبت فروشگاه
          </Link>
        </div>
      </section>
    </div>
  );
}

function PopularVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const popular = vehicles.slice(0, 6);
  return (
    <section className="space-y-5">
      <SectionHeader
        title="خودروهای محبوب"
        description="قطعات سازگار با پرتکرارترین خودروهای بازار."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {popular.map((v) => (
          <Link
            key={v.id}
            href={`/products?vehicle=${encodeURIComponent(`${v.brand} ${v.model}`)}`}
            className="group rounded-2xl border border-edge bg-card p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop"
          >
            <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl border border-edge-strong bg-surface-2 text-ink-2 transition-colors group-hover:border-accent/30 group-hover:text-accent">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="text-[14px] font-bold text-ink transition-colors group-hover:text-accent">
              {v.brand}
            </div>
            <div className="mt-0.5 text-[12px] text-ink-3">
              {v.model} ({v.year})
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
