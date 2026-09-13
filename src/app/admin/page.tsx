import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

export default async function AdminPage() {
  if (!(await verifyAdminSession())) redirect("/admin/login");
  let researchers: Awaited<ReturnType<ReturnType<typeof getPrisma>["researcherSubmission"]["findMany"]>> = [];
  let companies: Awaited<ReturnType<ReturnType<typeof getPrisma>["companySubmission"]["findMany"]>> = [];
  let loadError = false;
  try { [researchers, companies] = await Promise.all([getPrisma().researcherSubmission.findMany({ orderBy: { createdAt: "desc" } }), getPrisma().companySubmission.findMany({ orderBy: { createdAt: "desc" } })]); }
  catch (error) { console.error("Admin dashboard data load failed", error); loadError = true; }
  return <main className="min-h-screen bg-[#f1f4f7] px-4 py-8 sm:px-6"><div className="mx-auto max-w-7xl"><header className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-black text-[#12345e]">پنل مدیریت</h1><p className="mt-1 text-sm text-slate-500">مشاهده اطلاعات ثبت‌شده</p></div><form action="/api/admin/logout" method="post"><button className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-bold text-slate-700">خروج</button></form></header>{loadError && <p className="mt-6 rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">دریافت اطلاعات با خطا مواجه شد. لطفاً دوباره تلاش کنید.</p>}<AdminTable title={`پژوهشگران (${researchers.length})`} exportHref="/api/admin/export/researchers" exportLabel="دانلود اکسل پژوهشگران" empty="هنوز پژوهشگری ثبت نشده است." headers={["نام و نام خانوادگی", "شماره تماس", "ایمیل", "حوزه پژوهشی", "عنوان پروژه", "تاریخ ثبت", "مشاهده"]} rows={researchers.map((r) => [r.fullName, r.phone, r.email, r.researchField, r.projectTitle, dateFormat.format(r.createdAt), <Link key={r.id} className="font-bold text-[#2878df]" href={`/admin/researchers/${r.id}`}>مشاهده</Link>])} /><AdminTable title={`نیازهای پژوهشی شرکت‌ها (${companies.length})`} exportHref="/api/admin/export/companies" exportLabel="دانلود اکسل نیازهای پژوهشی" empty="هنوز نیاز پژوهشی ثبت نشده است." headers={["نام شرکت", "نام تکمیل‌کننده", "شماره تماس", "ایمیل", "حوزه پژوهشی", "عنوان نیاز پژوهشی", "تاریخ ثبت", "مشاهده"]} rows={companies.map((c) => [c.companyName, c.contactName, c.phone, c.email, c.researchField, c.researchNeedTitle, dateFormat.format(c.createdAt), <Link key={c.id} className="font-bold text-[#2878df]" href={`/admin/companies/${c.id}`}>مشاهده</Link>])} /></div></main>;
}

function AdminTable({ title, exportHref, exportLabel, empty, headers, rows }: { title: string; exportHref: string; exportLabel: string; empty: string; headers: string[]; rows: React.ReactNode[][] }) {
  return <section className="mt-8 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(19,45,75,0.07)]"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black text-[#12345e]">{title}</h2><a href={exportHref} className="rounded-lg bg-[#168b4d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#11743f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168b4d]">{exportLabel}</a></div>{rows.length === 0 ? <p className="py-10 text-center text-slate-500">{empty}</p> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-right text-sm"><thead><tr className="bg-slate-50">{headers.map((h) => <th key={h} className="border-b border-slate-200 px-4 py-3 font-black text-[#294766]">{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-b border-slate-100 last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-4 text-slate-700">{cell}</td>)}</tr>)}</tbody></table></div>}</section>;
}
