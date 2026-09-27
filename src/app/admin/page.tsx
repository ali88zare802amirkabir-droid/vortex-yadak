import Link from "next/link";
import { getDashboardStats, getVendors, getProducts, getReservations } from "@/lib/db";
import { SectionHeader } from "@/components/shared/section-header";
import { formatStatus } from "@/lib/money";

export default async function AdminPage() {
  const stats = await getDashboardStats();
  const vendors = await getVendors();
  const products = await getProducts();
  const reservations = await getReservations();

  const cards = [
    { title: "تعداد فروشندگان", value: stats.totalVendors, icon: "🏪" },
    { title: "تعداد محصولات", value: stats.totalProducts, icon: "📦" },
    { title: "تعداد رزروها", value: stats.totalReservations, icon: "📝" },
    { title: "کاربران", value: stats.totalUsers, icon: "👥" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="پنل مدیریت" description="گزارش کلی سامانه (Demo)" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-xl border bg-card p-5">
            <span className="text-2xl">{c.icon}</span>
            <div className="mt-3 text-3xl font-bold">{c.value}</div>
            <div className="mt-1 text-sm text-ink-2">{c.title}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">فروشندگان ({vendors.length})</h3>
          <ul className="space-y-2 text-sm">
            {vendors.map((v) => (
              <li key={v.id} className="flex justify-between border-b last:border-0 pb-2">
                <span className="font-medium">{v.name}</span>
                <span className="text-ink-2 text-xs">{v.phone}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">آخرین محصولات</h3>
          <ul className="space-y-2 text-sm">
            {products.slice(0, 6).map((p) => (
              <li key={p.id} className="flex justify-between border-b last:border-0 pb-2">
                <span className="font-medium line-clamp-1">{p.name}</span>
                <span className="text-ink-2 text-xs whitespace-nowrap">{p.stock} عدد</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">آخرین رزروها</h3>
          {reservations.length === 0 ? (
            <p className="text-sm text-ink-2">رزروی ثبت نشده است</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {reservations.slice(0, 6).map((r) => (
                <li key={r.id} className="flex justify-between border-b last:border-0 pb-2">
                  <span className="font-medium">{r.customerName}</span>
                  <span className="text-ink-2 text-xs">{formatStatus(r.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href="/vendor" className="inline-flex h-9 items-center rounded-xl border border-edge bg-bg-soft px-4 text-sm font-medium hover:bg-accent">
          پنل فروشنده
        </Link>
        <Link href="/products" className="inline-flex h-9 items-center rounded-xl border border-edge bg-bg-soft px-4 text-sm font-medium hover:bg-accent">
          مشاهده فروشگاه
        </Link>
      </div>
    </div>
  );
}