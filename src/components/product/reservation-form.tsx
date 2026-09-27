"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reservationSchema } from "@/lib/validation";

export function ReservationForm({
  productId,
}: {
  productId: string;
  productName: string;
}) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    quantity: "1",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const validated = reservationSchema.parse({
        ...form,
        productId,
        quantity: Number(form.quantity),
      });
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "خطا در ثبت رزرو");
      }
      setSuccess(true);
      setForm({ customerName: "", phone: "", quantity: "1", note: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ثبت رزرو");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/40 dark:border-green-800 dark:text-green-200">
        رزرو شما ثبت شد. فروشنده پس از بررسی با شما تماس می‌گیرد.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border p-4 bg-background/60"
    >
      <h3 className="font-semibold text-sm">رزرو برای دریافت حضوری</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="نام"
          placeholder="نام کامل"
          value={form.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
          required
        />
        <Input
          label="شماره تماس"
          placeholder="0912..."
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
          type="tel"
        />
        <Input
          label="تعداد"
          type="number"
          min={1}
          max={50}
          value={form.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          required
        />
        <Input
          label="توضیح"
          placeholder="توضیح اختیاری..."
          value={form.note}
          onChange={(e) => handleChange("note", e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت..." : "ثبت رزرو"}
      </Button>
    </form>
  );
}
