import { getProductById, getVehicles, getVendors } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/components/product/reservation-form";
import { categoryEmoji } from "@/lib/category-emoji";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  const vehicles = await getVehicles();
  const vendors = await getVendors();
  const vendor = vendors.find((v) => v.id === product?.vendorId);
  const compatibleVehicles = vehicles.filter((v) =>
    product?.vehicleIds?.includes(v.id)
  );

  if (!product) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto text-5xl">🔍</div>
        <h3 className="mt-3 text-lg font-medium text-foreground">
          محصول پیدا نشد
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          لطفاً کد محصول را بررسی کنید
        </p>
        <Link href="/products" className="mt-4 inline-block text-primary">
          بازگشت به لیست محصولات
        </Link>
      </div>
    );
  }

  const stockBadge =
    product.stock <= 3
      ? "bg-red-100 text-red-700"
      : product.stock <= 10
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4 shadow-soft">
        <nav className="text-xs text-muted-foreground mb-3">
          <Link href="/products" className="hover:text-primary">
            محصولات
          </Link>{" "}
          / {product.name}
        </nav>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center text-6xl">
            {categoryEmoji(product.category)}
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{product.brand}</Badge>
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline" className={stockBadge}>
                  {product.stock} عدد
                </Badge>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            {product.technicalNo && (
              <div className="text-sm">
                <span className="text-muted-foreground">شماره فنی:</span>{" "}
                <span className="font-mono font-medium">
                  {product.technicalNo}
                </span>
              </div>
            )}
            {compatibleVehicles.length > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">سازگار با:</span>{" "}
                <span className="font-medium">
                  {compatibleVehicles
                    .map((v) => `${v.brand} ${v.model}`)
                    .join("، ")}
                </span>
              </div>
            )}
            {vendor && (
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">فروشگاه:</span>{" "}
                  <span className="font-medium">{vendor.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">آدرس:</span>{" "}
                  {vendor.address}
                </div>
                <div>
                  <span className="text-muted-foreground">تماس:</span>{" "}
                  {vendor.phone}
                </div>
              </div>
            )}
            <div className="pt-4">
              <ReservationForm
                productId={product.id}
                productName={product.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
