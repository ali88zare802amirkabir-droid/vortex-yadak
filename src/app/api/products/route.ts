import { NextResponse } from "next/server";
import { getRepo, addProduct } from "@/lib/db";
import { productFormSchema } from "@/lib/validation";
import type { Product } from "@/lib/db/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const vehicle = searchParams.get("vehicle") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "default";
  const q = searchParams.get("q") || "";

  const repo = await getRepo();
  let products: Product[] = q ? await repo.searchProducts(q) : await repo.getProducts();

  // Filters
  if (category) products = products.filter((p) => p.category === category);
  if (brand) products = products.filter((p) => p.brand === brand);
  if (vehicle) {
    const allVehicles = await repo.getVehicles();
    const label = vehicle.toLowerCase();
    const matched = allVehicles.filter(
      (v) =>
        v.id === vehicle ||
        `${v.brand} ${v.model}`.toLowerCase().includes(label)
    );
    const ids = new Set(matched.map((v) => v.id));
    products = products.filter((p) => p.vehicleIds.some((id) => ids.has(id)));
  }
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  // Sort
  if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "newest") products.reverse();

  return NextResponse.json({
    products,
    total: products.length,
    vehicles: await repo.getVehicles(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = productFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" },
        { status: 400 }
      );
    }
    const product = await addProduct({
      name: parsed.data.name.trim(),
      category: parsed.data.category,
      brand: parsed.data.brand.trim(),
      price: parsed.data.price,
      stock: parsed.data.stock,
      description: parsed.data.description.trim(),
      technicalNo: parsed.data.technicalNo?.trim() || undefined,
      imageUrl: parsed.data.imageUrl?.trim() || undefined,
      vendorId: "vendor1",
      vendorName: "یدک امیری",
      vendorCity: "بیرجند",
      vehicleIds: parsed.data.vehicleIds,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}