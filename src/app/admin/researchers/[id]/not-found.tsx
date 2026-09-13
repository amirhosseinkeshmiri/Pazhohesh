import Link from "next/link";
export default function NotFound() { return <main className="grid min-h-screen place-items-center bg-[#f1f4f7] p-6 text-center"><div><h1 className="text-3xl font-black text-[#12345e]">پژوهشگر یافت نشد</h1><Link href="/admin" className="mt-5 inline-block font-bold text-[#2878df]">بازگشت به پنل مدیریت</Link></div></main>; }
