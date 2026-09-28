import { getProductById, getVehicles, getVendors } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/components/product/reservation-form";
import { categoryEmoji } from "@/lib/category-emoji";
import Image from "next/image";
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
        <h3 className="mt-3 text-lg font-medium text-ink">
          محصول پیدا نشد
        </h3>
        <p className="mt-1 text-sm text-ink-2">
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
      <div className="rounded-xl border bg-card p-4 shadow-pop">
        <nav className="text-xs text-ink-2 mb-3">
          <Link href="/products" className="hover:text-primary">
            محصولات
          </Link>{" "}
          / {product.name}
        </nav>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-square rounded-xl bg-surface-2/40 flex items-center justify-center text-6xl overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              categoryEmoji(product.category)
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">
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
            <p className="text-sm text-ink-2 leading-relaxed">
              {product.description}
            </p>
            {product.technicalNo && (
              <div className="text-sm">
                <span className="text-ink-2">شماره فنی:</span>{" "}
                <span className="font-mono font-medium">
                  {product.technicalNo}
                </span>
              </div>
            )}
            {compatibleVehicles.length > 0 && (
              <div className="text-sm">
                <span className="text-ink-2">سازگار با:</span>{" "}
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
                  <span className="text-ink-2">فروشگاه:</span>{" "}
                  <span className="font-medium">{vendor.name}</span>
                </div>
                <div>
                  <span className="text-ink-2">آدرس:</span>{" "}
                  {vendor.address}
                </div>
                <div>
                  <span className="text-ink-2">تماس:</span>{" "}
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
