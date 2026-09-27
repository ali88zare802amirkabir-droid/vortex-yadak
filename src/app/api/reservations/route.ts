import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/validation";
import { addReservation, getProductById } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر است" },
        { status: 400 }
      );
    }
    const product = await getProductById(parsed.data.productId);
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }
    if (product.stock < parsed.data.quantity) {
      return NextResponse.json(
        { error: "موجودی کافی نیست" },
        { status: 400 }
      );
    }
    const reservation = await addReservation({
      productId: parsed.data.productId,
      productName: product.name,
      customerName: parsed.data.customerName.trim(),
      phone: parsed.data.phone.trim(),
      quantity: parsed.data.quantity,
      status: "NEW",
    });
    return NextResponse.json({ reservation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}