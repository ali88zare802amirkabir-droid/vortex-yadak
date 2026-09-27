"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/db/types";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.includes(q) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.category.includes(q)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("این محصول حذف شود؟")) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="مدیریت محصولات"
        description={`${filtered.length} محصول`}
        action={
          <Link
            href="/vendor/products/new"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + افزودن محصول
          </Link>
        }
      />

      <div className="max-w-sm">
        <Input placeholder="جستجو در محصولات..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-right">
              <th className="p-3 font-semibold">نام محصول</th>
              <th className="p-3 font-semibold">برند</th>
              <th className="p-3 font-semibold">قیمت</th>
              <th className="p-3 font-semibold">موجودی</th>
              <th className="p-3 font-semibold">وضعیت</th>
              <th className="p-3 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  محصولی یافت نشد
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3 whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <Badge variant={p.stock > 0 ? "success" : "destructive"}>
                      {p.stock > 0 ? "موجود" : "ناموجود"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/vendor/products/${p.id}/edit`}
                        className="text-xs text-primary hover:underline"
                      >
                        ویرایش
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-xs text-destructive hover:underline disabled:opacity-50"
                      >
                        {deleting === p.id ? "..." : "حذف"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}