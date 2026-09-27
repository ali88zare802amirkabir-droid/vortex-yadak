"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionHeader } from "@/components/shared/section-header";
import { productFormSchema } from "@/lib/validation";
import type { Product, Vehicle } from "@/lib/db/types";

const CATEGORIES = ["موتور", "ترمز", "برق", "بدنه", "جلوبندی", "مصرفی"];

export function ProductForm({
  vehicles,
  initial,
}: {
  vehicles: Vehicle[];
  initial?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    brand: initial?.brand ?? "",
    price: initial ? String(initial.price) : "",
    stock: initial ? String(initial.stock) : "",
    description: initial?.description ?? "",
    technicalNo: initial?.technicalNo ?? "",
    imageUrl: initial?.imageUrl ?? "",
    vehicleIds: initial?.vehicleIds ?? [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleVehicle = (id: string) =>
    setForm((prev) => ({
      ...prev,
      vehicleIds: prev.vehicleIds.includes(id)
        ? prev.vehicleIds.filter((v) => v !== id)
        : [...prev.vehicleIds, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    const parsed = productFormSchema.safeParse({
      name: form.name,
      category: form.category,
      brand: form.brand,
      vehicleIds: form.vehicleIds,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      technicalNo: form.technicalNo || undefined,
      imageUrl: form.imageUrl || undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    try {
      const url = initial ? `/api/products/${initial.id}` : "/api/products";
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "خطا در ذخیره محصول");
      }
      router.push("/vendor/products");
      router.refresh();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "خطا در ذخیره محصول");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionHeader
        title={initial ? "ویرایش محصول" : "افزودن محصول جدید"}
        description="همه ورودی‌ها با Zod اعتبارسنجی می‌شوند"
      />
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <Input label="نام قطعه" placeholder="مثلاً: لنت ترمز جلو پژو 206" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="دسته‌بندی" value={form.category} onChange={(e) => set("category", e.target.value)} options={CATEGORIES.map((c) => ({ value: c, label: c }))} placeholder="انتخاب کنید" error={errors.category} />
          <Input label="برند" placeholder="مثلاً: NGK" value={form.brand} onChange={(e) => set("brand", e.target.value)} error={errors.brand} />
        </div>
        <div>
          <span className="block text-sm font-medium mb-2">خودروهای سازگار</span>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => {
              const active = form.vehicleIds.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => toggleVehicle(v.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:bg-accent"}`}
                >
                  {v.brand} {v.model}
                </button>
              );
            })}
          </div>
          {errors.vehicleIds && <p className="mt-1 text-sm text-destructive">{errors.vehicleIds}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="قیمت (تومان)" type="number" min={0} placeholder="850000" value={form.price} onChange={(e) => set("price", e.target.value)} error={errors.price} />
          <Input label="تعداد موجودی" type="number" min={0} placeholder="5" value={form.stock} onChange={(e) => set("stock", e.target.value)} error={errors.stock} />
        </div>
        <Input label="شماره فنی (اختیاری)" placeholder="T1234" value={form.technicalNo} onChange={(e) => set("technicalNo", e.target.value)} error={errors.technicalNo} />
        <Input label="آدرس تصویر (اختیاری)" placeholder="https://..." value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} error={errors.imageUrl} />
        <div>
          <label className="block text-sm font-medium mb-1">توضیحات</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="توضیحات کامل محصول..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
        </div>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "در حال ذخیره..." : initial ? "ذخیره تغییرات" : "افزودن محصول"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/vendor/products")}>
            انصراف
          </Button>
        </div>
      </form>
    </div>
  );
}
