# Vortex Yadak — Demo Prototype

Marketplace تخصصی قطعات یدکی خودرو برای اتصال خریداران به فروشندگان. این پروژه یک **نمونه‌ساز (Prototype)** برای اعتبارسنجی بازار و نمایش به فروشندگان است.

## ✨ امکانات Demo

- **صفحه اصلی**: جستجوی هوشمند، دسته‌بندی‌ها، خودروهای محبوب، محصولات برتر
- **لیست محصولات**: فیلتر بر اساس دسته، برند، قیمت، خودرو + مرتب‌سازی
- **جزئیات محصول**: مشخصات، سازگاری، اطلاعات فروشگاه، فرم رزرو حضوری
- **مقایسه محصولات**: مقایسه جانبی دو محصول
- **پنل فروشنده**: داشبورد، مدیریت محصولات (افزودن/ویرایش/حذف)، مدیریت رزروها
- **پنل مدیریت**: آمار کلی، لیست فروشندگان/محصولات/رزروها

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Database | PostgreSQL (Prisma 7 + driver adapter) |
| Validation | Zod 4 |
| Font | Vazirmatn (next/font/google) |
| Deploy | Render (Docker-free, Node.js) |

## 🚀 اجرا

### پیش‌نیازها
- Node.js 22+
- npm 12+
- PostgreSQL 15+ (اختیاری - برای محیط production)

### نصب و اجرا (Demo بدون دیتابیس)
```bash
# 1. کلون و نصب وابستگی‌ها
git clone <repo-url>
cd "Vortex Yadak"
npm install

# 2. اجرای سرور توسعه
npm run dev
# باز کردن http://localhost:3000
```

> ⚡ **نکته مهم**: پروژه به‌صورت پیش‌فرض با **داده‌های حافظه (In-Memory)** اجرا می‌شود. نیازی به PostgreSQL محلی ندارید. داده‌های ۵ فروشگاه و ۵۰+ محصول بلافاصله بارگذاری می‌شوند.

### اجرا با PostgreSQL (Production-like)
```bash
# 1. کپی فایل محیط
cp .env.example .env

# 2. تنظیم DATABASE_URL در .env
# DATABASE_URL="postgresql://user:pass@localhost:5432/vortex_yadak"

# 3. تولید Prisma Client و ساخت جداول
npm run db:generate
npm run db:push

# 4. seed داده‌های نمونه
npm run db:seed

# 5. اجرای سرور
npm run dev
```

## 📦 اسکریپت‌ها

| دستور | توضیح |
|--------|-------|
| `npm run dev` | سرور توسعه Next.js |
| `npm run build` | بیلد production |
| `npm run start` | اجرای بیلد production |
| `npm run lint` | بررسی ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:push` | `prisma db push` (ایجاد جداول) |
| `npm run db:seed` | `tsx prisma/seed.ts` (داده‌های نمونه) |

## 🏗 معماری

```
src/
├── app/                    # Next.js App Router
│   ├── (customer)/         # مسیرهای مشتری
│   │   ├── page.tsx        # صفحه اصلی
│   │   ├── products/       # لیست و جزئیات محصول
│   │   └── compare/        # مقایسه
│   ├── vendor/             # پنل فروشنده
│   │   ├── page.tsx        # داشبورد
│   │   ├── products/       # CRUD محصولات
│   │   └── orders/         # مدیریت رزروها
│   ├── admin/              # پنل مدیریت
│   └── api/                # API Routes
├── components/
│   ├── ui/                 # کامپوننت‌های پایه (Button, Input, Select, Badge)
│   ├── layout/             # Header, Footer, SearchHero
│   ├── product/            # ProductCard, ReservationForm
│   ├── vendor/             # ProductForm, VendorCard
│   └── shared/             # SectionHeader
├── lib/
│   ├── db/                 # لایه دسترسی داده (Repository Pattern)
│   │   ├── index.ts        # انتخاب خودکار Memory ↔ Prisma
│   │   ├── memory.ts       # ذخیره‌ساز حافظه (Demo)
│   │   ├── prisma.ts       # پیاده‌سازی Prisma + Driver Adapter
│   │   └── types.ts        # تایپ‌های مشترک
│   ├── validation.ts       # اسکیماهای Zod
│   ├── money.ts            # فرمت‌دهی قیمت/وضعیت
│   └── utils.ts            # cn() برای ترکیب کلاس‌ها
└── design/
    └── tokens.css          # توکن‌های طراحی (CSS Variables)

prisma/
├── schema.prisma           # مدل‌های دیتابیس
└── seed.ts                 # اسکریپت seed
```

### Repository Pattern
همه پرس‌وجوها از طریق `src/lib/db/index.ts` عبور می‌کنند:
- اگر `DATABASE_URL` تنظیم باشد → Prisma/PostgreSQL
- وگرنه → In-Memory Store (Demo)
این باعث می‌شود **بدون هیچ پیکربندی** پروژه اجرا شود.

## 🎨 طراحی

- **RTL کامل** + فونت فارسی وزیرمتن
- **Glass/Layered UI**: کارت‌های با backdrop-blur، سایه‌های لایه‌ای
- **پالت**: آبی تکنولوژی (sky-500) + نارنجی/آمبر (accent خودرو)
- **Responsive**: Mobile-first، breakpointهای sm/md/lg/xl
- **Accessibility**: رنگ‌های کنتراستی، focus-visible، semantic HTML

## 🔐 امنیت پایه
- اعتبارسنجی تمام ورودی‌ها با Zod (سرور + کلاینت)
- جلوگیری از XSS (خروجی امن در React)
- متغیرهای محیطی حساس در `.env` (کامیت نمی‌شوند)
- جداسازی نقش‌ها: Customer / Vendor / Admin

## 🚀 استقرار روی Render

1. مخزن را به GitHub/GitLab push کنید
2. در Render New → Web Service، مخزن را انتخاب کنید
3. `render.yaml` به‌صورت خودکار شناسایی می‌شود:
   - Build: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - Start: `npm start`
   - دیتابیس PostgreSQL رایگان provision می‌شود
4. Environment Variable `DATABASE_URL` به‌صورت خودکار از دیتابیس Render تزریق می‌شود

## 📋 Roadmap (نسخه واقعی)
- [ ] احراز هویت کامل (OTP/SSO)
- [ ] درگاه پرداخت و کیف پول فروشنده
- [ ] سیستم کمیسیون و تسویه
- [ ] ارسال/پیک و ردیابی مرسوله
- [ ] چت خریدار-فروشنده
- [ ] مدیریت مالی/صورتحساب
- [ ] پنل پشتیبانی و تیکتینگ
- [ ] سئو و SSR بهینه برای محصولات

## 📄 لایسنس
MIT — استفاده آزاد برای مقاصد تجاری/آموزشی.

---

**Vortex Yadak** — ساخته شده برای اعتبارسنجی بازار قطعات یدکی ایران 🇮🇷