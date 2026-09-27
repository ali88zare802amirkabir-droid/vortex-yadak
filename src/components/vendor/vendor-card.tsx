import Link from "next/link";
import { Phone } from "lucide-react";
import { Vendor } from "@/lib/db/types";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendor/${vendor.id}`}
      className="group flex flex-col items-center rounded-2xl border border-edge bg-card p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-pop"
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-lg font-bold text-white shadow-[0_4px_16px_-6px_rgba(217,70,239,0.7)]">
        {vendor.name.charAt(0)}
      </span>
      <h3 className="line-clamp-1 text-[14px] font-semibold text-ink transition-colors group-hover:text-accent">
        {vendor.name}
      </h3>
      <p className="mt-1 line-clamp-1 text-[12px] text-ink-3">{vendor.address}</p>
      <span className="mt-3 flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 text-[12px] text-ink-2 transition-colors group-hover:text-accent">
        <Phone className="h-3.5 w-3.5" />
        <span dir="ltr">{vendor.phone}</span>
      </span>
    </Link>
  );
}
