import Link from "next/link";
import { Mail, Phone, Store, type LucideIcon } from "lucide-react";

const CATEGORIES = ["موتور", "ترمز", "برق", "بدنه", "جلوبندی", "مصرفی"];
const VEHICLES = ["پژو 206", "پژو 405", "سمند", "پراید", "دنا", "تیبا"];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-[13px] font-semibold text-ink">{title}</h4>
      <ul className="space-y-2 text-[13px] text-ink-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-accent">
        {children}
      </Link>
    </li>
  );
}

function ContactRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-ink-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-ink-3" />
      <span>{children}</span>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 border-t border-edge bg-surface-2/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
              <Store className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-ink">
              ورتکس<span className="text-accent">یدک</span>
            </span>
          </Link>
          <p className="mt-3.5 text-[13px] leading-relaxed text-ink-2">
            بازار تخصصی قطعات یدکی خودرو. قطعه مناسب خودروت را پیدا کن، موجودی را ببین و
            حضوری دریافت کن.
          </p>
        </div>

        <FooterColumn title="دسته‌بندی‌ها">
          {CATEGORIES.map((c) => (
            <FooterLink key={c} href={`/products?category=${encodeURIComponent(c)}`}>
              {c}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="خودروهای محبوب">
          {VEHICLES.map((v) => (
            <FooterLink key={v} href={`/products?vehicle=${encodeURIComponent(v)}`}>
              {v}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="ارتباط">
          <ContactRow icon={Phone}>پشتیبانی: ۰۲۱-۰۰۰۰-۰۰۰۰</ContactRow>
          <ContactRow icon={Mail}>info@vortexyadak.ir</ContactRow>
        </FooterColumn>
      </div>

      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Vortex Yadak — نمونه اولیه</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            ساخته‌شده برای اعتبارسنجی بازار
          </span>
        </div>
      </div>
    </footer>
  );
}
