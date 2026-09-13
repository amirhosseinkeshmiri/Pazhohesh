import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { verifyAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await verifyAdminSession()) redirect("/admin");
  return <main className="grid min-h-screen place-items-center bg-[#f1f4f7] px-4 py-10"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_12px_45px_rgba(19,45,75,0.10)] sm:p-9"><h1 className="text-center text-3xl font-black text-[#12345e]">ورود مدیریت</h1><p className="mt-2 text-center text-sm text-slate-500">برای مشاهده اطلاعات ثبت‌شده وارد شوید.</p><LoginForm /></section></main>;
}
