import { NextResponse } from "next/server";
import { updateReservationStatus } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status?: string };
    if (!status || !["NEW", "CONFIRMED", "DELIVERED"].includes(status)) {
      return NextResponse.json({ error: "وضعیت نامعتبر است" }, { status: 400 });
    }
    const reservation = await updateReservationStatus(id, status as "NEW" | "CONFIRMED" | "DELIVERED");
    return NextResponse.json({ reservation });
  } catch {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}