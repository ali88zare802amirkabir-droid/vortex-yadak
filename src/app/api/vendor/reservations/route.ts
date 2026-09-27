import { NextResponse } from "next/server";
import { getReservations } from "@/lib/db";

export async function GET() {
  const reservations = await getReservations();
  return NextResponse.json({ reservations });
}