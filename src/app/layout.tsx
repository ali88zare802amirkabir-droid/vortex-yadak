import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import "../design/tokens.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ورتکس یدک — Marketplace قطعات یدکی خودرو",
  description: "پیدا کردن قطعه مورد نیاز خودروت، مشاهده موجودی و دریافت حضوری.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}