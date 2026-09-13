import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DetailCard } from "@/components/admin/DetailCard";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { existingUploadPath } from "@/lib/upload";
import { prismaErrorCode, safeErrorName } from "@/lib/submission-errors";

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeStyle: "short" });
const dayFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" });

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession())) redirect("/admin/login");
  const { id } = await params;
  let record;
  try { record = await getPrisma().companySubmission.findUnique({ where: { id } }); }
  catch (error) { console.warn(`[admin] company detail database failure (${prismaErrorCode(error) ?? safeErrorName(error)})`); return <DataError />; }
  if (!record) notFound();
  const [attachmentPath, completedFormPath] = await Promise.all([existingUploadPath(record.attachmentPath), existingUploadPath(record.completedFormPath)]);
  return <DetailShell><DetailCard title="جزئیات نیاز پژوهشی شرکت" items={[["نام شرکت", record.companyName], ["نام و نام خانوادگی مدیرعامل / تکمیل‌کننده", record.contactName], ["سمت تکمیل‌کننده", record.position], ["شماره تماس", record.phone], ["ایمیل", record.email], ["تاریخ تکمیل", dayFormat.format(record.completionDate)], ["عنوان نیاز پژوهشی", record.researchNeedTitle], ["حوزه پژوهشی", record.researchField], ["تاریخ ثبت", dateFormat.format(record.createdAt)]]} description={["شرح مسئله و نیاز پژوهشی", record.problemDescription]} /><div className="mt-5 grid gap-3 rounded-xl bg-white p-5 sm:grid-cols-2"><FileLink path={attachmentPath} label="مشاهده فایل پیوست" empty={record.attachmentPath ? "فایل پیوست در دسترس نیست." : "فایل پیوست ارائه نشده است."} /><FileLink path={completedFormPath} label="دانلود فرم تکمیل‌شده" empty={record.completedFormPath ? "فرم تکمیل‌شده در دسترس نیست." : "فرم تکمیل‌شده ارائه نشده است."} /></div></DetailShell>;
}

function DetailShell({ children }: { children: React.ReactNode }) { return <main className="min-h-screen bg-[#f1f4f7] px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><Link href="/admin" className="mb-5 inline-block font-bold text-[#2878df]">بازگشت به پنل مدیریت</Link>{children}</div></main>; }
function FileLink({ path, label, empty }: { path: string | null; label: string; empty: string }) { return path ? <a href={path} target="_blank" rel="noopener noreferrer" className="font-bold text-[#2878df]">{label}</a> : <p className="text-slate-500">{empty}</p>; }
function DataError() { return <DetailShell><p className="rounded-xl bg-red-50 p-5 text-center font-bold text-red-700">دریافت اطلاعات با خطا مواجه شد.</p></DetailShell>; }
