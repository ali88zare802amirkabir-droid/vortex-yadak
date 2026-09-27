import { NextResponse } from "next/server";
import { productFormSchema } from "@/lib/validation";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product)
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" },
        { status: 400 }
      );
    }
    const existing = await getProductById(id);
    if (!existing)
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    const product = await updateProduct(id, {
      name: parsed.data.name.trim(),
      category: parsed.data.category,
      brand: parsed.data.brand.trim(),
      price: parsed.data.price,
      stock: parsed.data.stock,
      description: parsed.data.description.trim(),
      technicalNo: parsed.data.technicalNo?.trim() || undefined,
      imageUrl: parsed.data.imageUrl?.trim() || undefined,
      vehicleIds: parsed.data.vehicleIds,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getProductById(id);
    if (!existing)
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
