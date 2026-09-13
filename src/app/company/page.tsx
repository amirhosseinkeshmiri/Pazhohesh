"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { submitForm } from "@/lib/client-submission";

const controlClass = "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#159765] focus:ring-3 focus:ring-emerald-100";

function Field({ id, label, type = "text", placeholder, dir }: { id: string; label: string; type?: "text" | "tel" | "email" | "date"; placeholder?: string; dir?: "ltr" | "rtl" }) {
  return <div className="min-w-0"><label htmlFor={id} className="mb-2 block text-sm font-bold text-[#243f60]">{label}<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><input id={id} name={id} type={type} dir={dir} required placeholder={placeholder} className={`${controlClass} ${dir === "ltr" ? "text-left" : "text-right"}`} /></div>;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-[#168b5b]" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M4 21V8l8-4v17M12 10h8v11M8 9v.01M8 13v.01M8 17v.01M16 14v.01M16 18v.01M3 21h18" /></svg></span><h2 id={id} className="text-lg font-black text-[#168b5b] sm:text-xl">{children}</h2></div>;
}

export default function CompanyPage() {
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitLock.current) return;
    submitLock.current = true;
    const form = event.currentTarget; setSubmitting(true); setMessage(null);
    try {
      const successMessage = await submitForm("/api/submissions/company", form);
      setMessage({ type: "success", text: successMessage || "نیاز پژوهشی شما با موفقیت ثبت شد." }); form.reset();
    } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." }); }
    finally { submitLock.current = false; setSubmitting(false); }
  }
  return (
    <main className="min-h-screen bg-[#f1f4f7] px-3 py-5 sm:px-6 sm:py-10">
      <div className="mx-auto w-full min-w-0 max-w-[920px]">
        <div className="w-full min-w-0 rounded-2xl bg-white px-5 py-7 shadow-[0_10px_38px_rgba(19,45,75,0.10)] sm:px-10 sm:py-10">
          <header className="text-center">
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#41617f] hover:text-[#168b5b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6" /></svg>بازگشت به صفحه اصلی</Link>
            <h1 className="text-3xl font-black leading-snug text-[#12345e] sm:text-[38px]">ثبت نیاز پژوهشی شرکت</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">اطلاعات موردنیاز را تکمیل کنید تا نیاز پژوهشی یا چالش فناورانه شما بررسی شود.</p>
          </header>

          <div className="hero-tech relative mx-auto mt-7 flex min-h-48 max-w-[700px] overflow-hidden rounded-xl px-7 py-7 text-white sm:min-h-60 sm:px-12">
            <div className="relative z-10 my-auto text-right"><p className="text-2xl font-black leading-relaxed sm:text-3xl">حمایت از<br />پژوهش‌های کاربردی</p><p className="mt-4 text-sm text-blue-100">Research Pitch</p></div>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 w-full min-w-0" aria-label="فرم ثبت نیاز پژوهشی شرکت">
            <section aria-labelledby="company-info-title">
              <SectionHeading id="company-info-title">اطلاعات شرکت</SectionHeading>
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <Field id="companyName" label="نام شرکت" placeholder="نام شرکت را وارد کنید" />
                <Field id="contactName" label="نام و نام خانوادگی مدیرعامل / تکمیل‌کننده" placeholder="نام و نام خانوادگی را وارد کنید" />
                <Field id="position" label="سمت تکمیل‌کننده" placeholder="سمت خود را وارد کنید" />
                <Field id="phone" label="شماره تماس" type="tel" dir="ltr" placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
                <Field id="email" label="ایمیل" type="email" dir="ltr" placeholder="name@example.com" />
                <Field id="completionDate" label="تاریخ تکمیل" type="date" />
              </div>
            </section>

            <section className="mt-10" aria-labelledby="need-info-title">
              <SectionHeading id="need-info-title">اطلاعات نیاز پژوهشی</SectionHeading>
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <Field id="researchNeedTitle" label="عنوان نیاز پژوهشی" placeholder="عنوان نیاز پژوهشی را وارد کنید" />
                <div><label htmlFor="researchField" className="mb-2 block text-sm font-bold text-[#243f60]">حوزه پژوهشی<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><select id="researchField" name="researchField" required defaultValue="" className={`${controlClass} cursor-pointer text-right`}><option value="" disabled>انتخاب حوزه پژوهشی</option>{["هوش مصنوعی", "سلامت", "انرژی‌های تجدیدپذیر", "میکروالکترونیک", "فناوری اطلاعات و ارتباطات", "فین‌تک", "سایر"].map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
                <div className="md:col-span-2"><label htmlFor="problemDescription" className="mb-2 block text-sm font-bold text-[#243f60]">شرح مسئله و نیاز پژوهشی<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><textarea id="problemDescription" name="problemDescription" required rows={6} placeholder="مسئله، چالش یا نیاز پژوهشی شرکت را به صورت کامل شرح دهید" className="min-h-40 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-base leading-8 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#159765] focus:ring-3 focus:ring-emerald-100" /></div>
              </div>
            </section>

            <section className="mt-7" aria-labelledby="attachment-title">
              <h2 id="attachment-title" className="mb-1 text-sm font-bold text-[#243f60]">بارگذاری فایل پیوست</h2>
              <p className="mb-3 text-xs leading-6 text-slate-500">فایل‌های مرتبط، مستندات فنی، تصاویر، گزارش‌ها و فایل‌های Word/PDF</p>
              <div className="rounded-xl border border-slate-300 bg-white px-4 py-6 text-center sm:px-6"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 h-9 w-9 text-[#0f5594]"><path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></svg><p className="mb-3 text-sm font-bold text-[#264867]">فایل خود را انتخاب کنید یا اینجا بکشید</p><input id="attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.zip" className="mx-auto block max-w-full text-sm text-slate-600 file:ml-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#e8f1fb] file:px-4 file:py-2 file:font-bold file:text-[#2468ad] hover:file:bg-[#dceafa]" /><p className="mt-3 text-xs text-slate-500">فرمت‌های مجاز: PDF، Word و ZIP · حداکثر حجم فایل: ۵۰ مگابایت</p></div>
            </section>

            <section className="mt-6 rounded-xl border border-[#b9cbe0] bg-[#f5f8fc] p-4 sm:p-5" aria-labelledby="word-form-title">
              <h2 id="word-form-title" className="text-sm font-black leading-7 text-[#254564]">فرم تکمیلی نیاز پژوهشی</h2>
              <p className="mt-1 text-xs leading-6 text-slate-600">در صورت تمایل، فرم Word را دانلود کرده، تکمیل کنید و فایل تکمیل‌شده را بارگذاری نمایید.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" disabled title="فایل فرم Word هنوز اضافه نشده است" className="flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#7da3ce] bg-white px-4 text-sm font-bold text-[#315f91] opacity-70"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></svg>دانلود فرم Word</button>
                <div className="relative flex min-h-12 items-center justify-center rounded-lg border border-[#7da3ce] bg-white px-3"><label htmlFor="completedForm" className="cursor-pointer text-center text-sm font-bold text-[#315f91]">بارگذاری فرم تکمیل‌شده</label><input id="completedForm" name="completedForm" type="file" accept=".doc,.docx,.pdf" className="absolute inset-0 cursor-pointer opacity-0" /></div>
              </div>
            </section>

            <button type="submit" disabled={submitting} className="mt-7 h-13 w-full rounded-lg bg-[#16975f] px-8 text-lg font-black text-white shadow-sm hover:bg-[#128451] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-65">{submitting ? "در حال ثبت..." : "ثبت نیاز پژوهشی"}</button>
            {message && <p role="status" className={`mt-4 rounded-lg px-4 py-3 text-center text-sm font-bold ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
