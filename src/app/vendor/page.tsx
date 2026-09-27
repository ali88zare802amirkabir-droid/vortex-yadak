import Link from "next/link";
import { getDashboardStats, getReservations, getProducts } from "@/lib/db";
import { formatPrice, formatStatus, getStatusColor } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

export default async function VendorDashboard() {
  const stats = await getDashboardStats();
  const reservations = await getReservations();
  const products = await getProducts();
  const lowStock = products.filter((p) => p.stock <= 5).slice(0, 8);
  const recent = reservations.slice(0, 6);

  const cards = [
    { title: "تعداد محصولات", value: stats.totalProducts, icon: "📦" },
    { title: "بازدید امروز", value: stats.todayViews, icon: "👁️" },
    { title: "رزرو امروز", value: stats.todayReservations, icon: "📝" },
    { title: "محصولات کم‌موجود", value: stats.lowStock, icon: "⚠️" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="داشبورد فروشنده"
        description="نمای کلی فروشگاه یدک امیری (Demo)"
        action={
          <div className="flex gap-2">
            <Link
              href="/vendor/products/new"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + افزودن محصول
            </Link>
            <Link
              href="/vendor/orders"
              className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
            >
              رزروها
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{c.icon}</span>
            </div>
            <div className="mt-3 text-3xl font-bold">{c.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.title}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">آخرین رزروها</h3>
            <Link href="/vendor/orders" className="text-xs text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز رزروی ثبت نشده است</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <div className="font-medium">{r.customerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.productName} × {r.quantity}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(getStatusColor(r.status))}>
                    {formatStatus(r.status)}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">محصولات کم‌موجود (≤ ۵)</h3>
            <Link href="/vendor/products" className="text-xs text-primary hover:underline">
              مدیریت محصولات
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">همه محصولات موجودی کافی دارند</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.brand}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-destructive">{p.stock} عدد</div>
                    <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}