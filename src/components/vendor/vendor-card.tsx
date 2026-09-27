import { Vendor } from "@/lib/db/types";
import Link from "next/link";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-card-hover hover:border-sky-300 transition-all text-center">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-amber-400 text-white text-xl font-bold mx-auto">
        {vendor.name.charAt(0)}
      </div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{vendor.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{vendor.address}</p>
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {vendor.phone}
        </span>
      </div>
    </Link>
  );
}