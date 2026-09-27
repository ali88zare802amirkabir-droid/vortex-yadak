import { NextResponse } from "next/server";
import { getRepo } from "@/lib/db";
import type { SearchSuggestion } from "@/lib/db/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ suggestions: [] });

  const repo = await getRepo();
  const products = await repo.getProducts();
  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();
  const lower = q.toLowerCase();

  for (const p of products) {
    if (p.name.toLowerCase().includes(lower)) {
      if (!seen.has(p.name)) { seen.add(p.name); suggestions.push({ text: p.name, type: "product" }); }
    }
    if (p.brand.toLowerCase().includes(lower) && !seen.has(p.brand)) { seen.add(p.brand); suggestions.push({ text: p.brand, type: "product" }); }
    if (p.category.includes(lower) && !seen.has(p.category)) { seen.add(p.category); suggestions.push({ text: p.category, type: "category" }); }
    if (p.technicalNo?.toLowerCase().includes(lower) && !seen.has(p.technicalNo!)) { seen.add(p.technicalNo!); suggestions.push({ text: p.technicalNo!, type: "product" }); }
  }

  const vehicles = await repo.getVehicles();
  for (const v of vehicles) {
    const label = `${v.brand} ${v.model}`;
    if (label.includes(lower) && !seen.has(label)) { seen.add(label); suggestions.push({ text: label, type: "vehicle" }); }
  }

  return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
}