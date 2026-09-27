import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Battery, Disc, Droplets, Gauge, Settings2 } from "lucide-react";
import { Product } from "@/lib/db/types";
import { formatPrice } from "@/lib/money";
import { Badge } from "@/components/ui/badge";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  موتور: Settings2,
  ترمز: Disc,
  برق: Battery,
  بدنه: Gauge,
  جلوبندی: Gauge,
  مصری: Droplets,
};

function stockTone(stock: number) {
  if (stock > 10) return { tone: "success" as const, label: "موجود" };
  if (stock > 3) return { tone: "warning" as const, label: "آخرین موجودی" };
  return { tone: "destructive" as const, label: "ناموجود" };
}

export function ProductCard({ product }: { product: Product }) {
  const Icon = CATEGORY_ICON[product.category] ?? Settings2;
  const stock = stockTone(product.stock);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop"
    >
      <div className="relative aspect-4/3 overflow-hidden border-b border-edge bg-gradient-to-br from-surface-2 to-bg-soft">
        <div className="absolute inset-0 bg-grid opacity-40 transition-opacity duration-300 group-hover:opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-edge-strong bg-surface-2/80 shadow-pop transition-transform duration-300 group-hover:scale-105">
            <Icon className="h-7 w-7 text-accent" />
          </div>
        </div>
        <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1.5">
          <Badge tone="accent">{product.category}</Badge>
        </div>
        <div className="absolute left-3 top-3">
          <Badge tone={stock.tone}>
            {stock.label} · {product.stock}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-ink transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="line-clamp-2 min-h-9 text-[12.5px] leading-relaxed text-ink-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink-3">
              {product.brand}
            </p>
            <p className="font-display text-[17px] font-bold text-ink">
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="text-left">
            <p className="line-clamp-1 text-[11px] text-ink-3">فروشنده</p>
            <p className="line-clamp-1 text-[12px] font-medium text-ink-2">
              {product.vendorName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
