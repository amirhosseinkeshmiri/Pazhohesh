import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({ variable: "--font-vazirmatn", subsets: ["arabic"], display: "swap" });

export const metadata: Metadata = {
  title: "حمایت از پژوهش‌های کاربردی",
  description: "سامانه ثبت راهکار و نیاز پژوهشی",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}><body className="min-h-full">{children}</body></html>;
}
