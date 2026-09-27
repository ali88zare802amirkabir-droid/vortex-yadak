"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product, Vehicle } from "@/lib/db/types";

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sort") || "default";
  const vehicle = searchParams.get("vehicle") || "";

  const [searchDraft, setSearchDraft] = useState(q);
  const [minDraft, setMinDraft] = useState(minPrice);
  const [maxDraft, setMaxDraft] = useState(maxPrice);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          "/api/products?" +
            new URLSearchParams({
              ...(q && { q }),
              ...(category && { category }),
              ...(brand && { brand }),
              ...(vehicle && { vehicle }),
              ...(minPrice && { minPrice }),
              ...(maxPrice && { maxPrice }),
              ...(sortBy !== "default" && { sort: sortBy }),
            }).toString(),
          { signal: controller.signal }
        );
        const data = await res.json();
        setProducts(data.products || []);
        if (data.vehicles) setVehicles(data.vehicles);
      } catch {
        if (!controller.signal.aborted) setProducts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [q, category, brand, vehicle, minPrice, maxPrice, sortBy]);

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
        <form
          className="flex items-center gap-2 w-full sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleFilterChange("q", searchDraft.trim());
          }}
        >
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="جستجوی نام، برند یا کد فنی..."
            className="w-full sm:w-64"
          />
          <Button type="submit" variant="outline">جستجو</Button>
        </form>
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
              {vehicles.length > 0 && (
                <div>
                  <label className="text-xs text-muted-foreground">خودرو</label>
                  <Select
                    value={vehicle}
                    onChange={(e) => handleFilterChange("vehicle", e.target.value)}
                    options={vehicles.map(v => ({
                      value: v.id,
                      label: `${v.brand} ${v.model}`,
                    }))}
                    placeholder="همه"
                  />
                </div>
              )}
              <div className="grid gap-2 grid-cols-2">
                <Input
                  label="حداقل قیمت"
                  placeholder="۰"
                  value={minDraft}
                  type="number"
                  onChange={(e) => setMinDraft(e.target.value)}
                  onBlur={() => handleFilterChange("minPrice", minDraft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFilterChange("minPrice", minDraft);
                  }}
                />
                <Input
                  label="حداکثر قیمت"
                  placeholder="۰"
                  value={maxDraft}
                  type="number"
                  onChange={(e) => setMaxDraft(e.target.value)}
                  onBlur={() => handleFilterChange("maxPrice", maxDraft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFilterChange("maxPrice", maxDraft);
                  }}
                />
              </div>
              <Button variant="outline" onClick={() => {
                setSearchDraft("");
                setMinDraft("");
                setMaxDraft("");
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