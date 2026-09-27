"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPrice } from "@/lib/money";
import { categoryEmoji } from "@/lib/category-emoji";
import type { Product } from "@/lib/db/types";
import Link from "next/link";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="text-sm text-ink-2">در حال بارگذاری...</div>}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [a, setA] = useState(searchParams.get("a") || "");
  const [b, setB] = useState(searchParams.get("b") || "");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, []);

  const pa = products.find((p) => p.id === a);
  const pb = products.find((p) => p.id === b);

  const options = products.map((p) => ({
    value: p.id,
    label: `${p.name} — ${p.brand}`,
  }));

  const rows: Array<{ label: string; va?: string; vb?: string }> = pa && pb
    ? [
        { label: "نام", va: pa.name, vb: pb.name },
        { label: "برند", va: pa.brand, vb: pb.brand },
        { label: "دسته‌بندی", va: pa.category, vb: pb.category },
        { label: "قیمت", va: formatPrice(pa.price), vb: formatPrice(pb.price) },
        { label: "موجودی", va: `${pa.stock} عدد`, vb: `${pb.stock} عدد` },
        { label: "فروشگاه", va: pa.vendorName, vb: pb.vendorName },
        { label: "شماره فنی", va: pa.technicalNo ?? "—", vb: pb.technicalNo ?? "—" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="مقایسه محصولات"
        description="دو محصول را انتخاب کنید تا قیمت، برند، موجودی و فروشگاه را کنار هم ببینید"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="محصول اول"
          value={a}
          onChange={(e) => setA(e.target.value)}
          options={options}
          placeholder="انتخاب محصول..."
        />
        <Select
          label="محصول دوم"
          value={b}
          onChange={(e) => setB(e.target.value)}
          options={options}
          placeholder="انتخاب محصول..."
        />
      </div>

      {pa && pb ? (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="grid grid-cols-3 border-b bg-surface-2/60 text-sm font-semibold">
            <div className="p-3">ویژگی</div>
            <div className="p-3 border-s text-center">
              <span className="text-lg">{categoryEmoji(pa.category)}</span>
              <Link href={`/products/${pa.id}`} className="block text-primary hover:underline text-xs mt-1">
                {pa.name}
              </Link>
            </div>
            <div className="p-3 border-s text-center">
              <span className="text-lg">{categoryEmoji(pb.category)}</span>
              <Link href={`/products/${pb.id}`} className="block text-primary hover:underline text-xs mt-1">
                {pb.name}
              </Link>
            </div>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 border-b last:border-0 text-sm">
              <div className="p-3 text-ink-2">{r.label}</div>
              <div className="p-3 border-s text-center font-medium">{r.va}</div>
              <div className="p-3 border-s text-center font-medium">{r.vb}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-ink-2">
          برای شروع مقایسه، هر دو محصول را انتخاب کنید
        </div>
      )}
    </div>
  );
}