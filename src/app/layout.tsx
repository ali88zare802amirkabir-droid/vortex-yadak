import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ورتکس یدک — بازار قطعات یدکی خودرو",
    template: "%s · ورتکس یدک",
  },
  description:
    "پیدا کردن قطعه مورد نیاز خودروت، مشاهده موجودی و دریافت حضوری. بازار تخصصی قطعات یدکی با استعلام قیمت و رزرو.",
};

export const viewport: Viewport = {
  themeColor: "#090d13",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-ink font-sans">
        <div className="app-bg" aria-hidden />
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
