import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DetailCard } from "@/components/admin/DetailCard";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { existingUploadPath } from "@/lib/upload";

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeStyle: "short" });

export default async function ResearcherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession())) redirect("/admin/login");
  const { id } = await params;
  let record;
  try { record = await getPrisma().researcherSubmission.findUnique({ where: { id } }); }
  catch (error) { console.error("Researcher detail load failed", error); return <DataError />; }
  if (!record) notFound();
  const attachmentPath = await existingUploadPath(record.attachmentPath);
  return <DetailShell><DetailCard title="جزئیات پژوهشگر" items={[["نام و نام خانوادگی", record.fullName], ["شماره تماس", record.phone], ["ایمیل", record.email], ["تحصیلات", record.education], ["دانشگاه / محل فعالیت", record.university], ["حوزه پژوهشی", record.researchField], ["تخصص / زمینه تخصصی", record.specialty], ["عنوان پروژه / راهکار پژوهشی", record.projectTitle], ["تاریخ ثبت", dateFormat.format(record.createdAt)]]} description={["شرح راهکار", record.solutionDescription]} /><FileLink path={attachmentPath} label="مشاهده فایل پیوست" empty={record.attachmentPath ? "فایل بارگذاری‌شده در دسترس نیست." : "فایلی بارگذاری نشده است."} /></DetailShell>;
}

function DetailShell({ children }: { children: React.ReactNode }) { return <main className="min-h-screen bg-[#f1f4f7] px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><Link href="/admin" className="mb-5 inline-block font-bold text-[#2878df]">بازگشت به پنل مدیریت</Link>{children}</div></main>; }
function FileLink({ path, label, empty }: { path: string | null; label: string; empty: string }) { return <div className="mt-5 rounded-xl bg-white p-5">{path ? <a href={path} target="_blank" rel="noopener noreferrer" className="font-bold text-[#2878df]">{label}</a> : <p className="text-slate-500">{empty}</p>}</div>; }
function DataError() { return <DetailShell><p className="rounded-xl bg-red-50 p-5 text-center font-bold text-red-700">دریافت اطلاعات با خطا مواجه شد.</p></DetailShell>; }
