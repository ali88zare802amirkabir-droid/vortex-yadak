import { Product } from "@/lib/db/types";
import { formatPrice, getStockColor } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-card-hover transition-all">
      <div className="aspect-square relative bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {product.category === "موتور" && "⚙️"}
          {product.category === "ترمز" && "🛞"}
          {product.category === "برق" && "🔋"}
          {product.category === "بدنه" && "🚗"}
          {product.category === "جلوبندی" && "🛞"}
          {product.category === "مصرفی" && "🧴"}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <Badge variant={product.stock > 10 ? "success" : product.stock > 3 ? "warning" : "destructive"} className="text-xs">
            {product.stock} عدد
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-medium">{product.brand}</span>
            <span>|</span>
            <span>{product.vendorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}