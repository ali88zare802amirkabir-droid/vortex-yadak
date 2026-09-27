"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { formatStatus, getStatusColor } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { Reservation, ReservationStatus } from "@/lib/db/types";

const TABS: Array<{ key: ReservationStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "همه" },
  { key: "NEW", label: "جدید" },
  { key: "CONFIRMED", label: "تایید شده" },
  { key: "DELIVERED", label: "تحویل شده" },
];

export default function VendorOrdersPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState<ReservationStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vendor/reservations")
      .then((r) => r.json())
      .then((d) => setReservations(d.reservations || []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    tab === "ALL" ? reservations : reservations.filter((r) => r.status === tab);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? data.reservation : r))
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="مدیریت رزروها" description={`${filtered.length} رزرو`} />

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              tab === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-edge bg-bg-soft hover:bg-accent"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-2">در حال بارگذاری...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-ink-2">
          رزروی در این بخش وجود ندارد
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{r.customerName}</div>
                  <div className="text-sm text-ink-2">
                    {r.productName} × {r.quantity} — {r.phone}
                  </div>
                  <div className="mt-1 text-xs text-ink-2">
                    {new Date(r.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </div>
                <Badge variant="outline" className={cn(getStatusColor(r.status))}>
                  {formatStatus(r.status)}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2">
                {r.status === "NEW" && (
                  <Button size="sm" onClick={() => updateStatus(r.id, "CONFIRMED")} disabled={updating === r.id}>
                    تایید
                  </Button>
                )}
                {r.status === "CONFIRMED" && (
                  <Button size="sm" onClick={() => updateStatus(r.id, "DELIVERED")} disabled={updating === r.id}>
                    تحویل شد
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}