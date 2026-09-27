import { getVehicles, getProductById } from "@/lib/db";
import { ProductForm } from "@/components/vendor/product-form";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicles, product] = await Promise.all([
    getVehicles(),
    getProductById(id),
  ]);

  if (!product) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium">محصول پیدا نشد</h3>
        <Link href="/vendor/products" className="mt-4 inline-block text-primary">
          بازگشت به لیست
        </Link>
      </div>
    );
  }

  return <ProductForm vehicles={vehicles} initial={product} />;
}