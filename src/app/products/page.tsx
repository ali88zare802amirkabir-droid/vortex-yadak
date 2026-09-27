"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/db/types";

const categories = ["موتور", "ترمز", "برق", "بدنه", "جلوبندی", "مصرفی"];
const brands = ["NGK", "فیلتر", "پمپ", "لنت", "آپتون", "گلسن", "فیات", "مابوچی", "پارس", "کرین", "میشلان", "دلکی", "Denso", "هوندا", "ژاپنی"];

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted/30" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-5 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
  const [vehicle, setVehicle] = useState(searchParams.get("vehicle") || "");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products?" + new URLSearchParams({
          ...(category && { category }),
          ...(brand && { brand }),
          ...(vehicle && { vehicle }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(sortBy && { sort: sortBy }),
        }).toString());
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [category, brand, vehicle, minPrice, maxPrice, sortBy]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">محصولات</h1>
        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            options={[
              { value: "default", label: "پیش‌فرض" },
              { value: "price_asc", label: "ارزان‌ترین" },
              { value: "price_desc", label: "گران‌ترین" },
              { value: "newest", label: "جدیدترین" },
            ]}
            placeholder="مرتب‌سازی"
            className="w-40"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold">فیلترها</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">دسته‌بندی</label>
                <Select
                  value={category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  options={categories.map(c => ({ value: c, label: c }))}
                  placeholder="همه"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">برند</label>
                <Select
                  value={brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  options={brands.map(b => ({ value: b, label: b }))}
                  placeholder="همه"
                />
              </div>
              <div className="grid gap-2 grid-cols-2">
                <Input label="حداقل قیمت" placeholder="۰" value={minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} type="number" />
                <Input label="حداکثر قیمت" placeholder="۰" value={maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} type="number" />
              </div>
              <Button variant="outline" onClick={() => {
                router.push("/products");
              }} className="w-full">پاک کردن فیلترها</Button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted/30" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-foreground">محصولی یافت نشد</h3>
              <p className="mt-1 text-sm text-muted-foreground">فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{products.length} محصول پیدا شد</p>
                <Badge variant="secondary" className="text-xs">نمایش {products.length} از {products.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}