import { getVehicles } from "@/lib/db";
import { ProductForm } from "@/components/vendor/product-form";

export default async function NewProductPage() {
  const vehicles = await getVehicles();
  return <ProductForm vehicles={vehicles} />;
}