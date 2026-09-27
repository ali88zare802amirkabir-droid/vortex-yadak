import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-flex items-center gap-2 font-bold text-sm tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-amber-400 text-white text-xs font-black">V</span>
            ورتکس یدک
          </span>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Marketplace تخصصی قطعات یدکی خودرو. پیدا کردن قطعه مناسب، مشاهده موجودی، دریافت حضوری.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">دسته‌بندی‌ها</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="/products?category=موتور" className="hover:text-foreground">موتور</Link></li>
            <li><Link href="/products?category=ترمز" className="hover:text-foreground">ترمز</Link></li>
            <li><Link href="/products?category=برق" className="hover:text-foreground">برق</Link></li>
            <li><Link href="/products?category=بدنه" className="hover:text-foreground">بدنه</Link></li>
            <li><Link href="/products?category=جلوبندی" className="hover:text-foreground">جلوبندی</Link></li>
            <li><Link href="/products?category=مصرفی" className="hover:text-foreground">مصرفی</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">خودروهای محبوب</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="/products?vehicle=پژو+206" className="hover:text-foreground">پژو 206</Link></li>
            <li><Link href="/products?vehicle=پژو+405" className="hover:text-foreground">پژو 405</Link></li>
            <li><Link href="/products?vehicle=سمند" className="hover:text-foreground">سمند</Link></li>
            <li><Link href="/products?vehicle=پراید" className="hover:text-foreground">پراید</Link></li>
            <li><Link href="/products?vehicle=دنا" className="hover:text-foreground">دنا</Link></li>
            <li><Link href="/products?vehicle=تیبا" className="hover:text-foreground">تیبا</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">ارتباط</h4>
          <p className="text-xs text-muted-foreground">پشتیبانی: 021-0000-0000</p>
          <p className="text-xs text-muted-foreground">info@vortexyadak.ir</p>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Vortex Yadak. Demo prototype.</span>
          <span>Made for market validation</span>
        </div>
      </div>
    </footer>
  );
}
