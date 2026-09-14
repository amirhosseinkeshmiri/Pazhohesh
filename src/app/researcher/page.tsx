"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { submitForm } from "@/lib/client-submission";

const inputClass = "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2878df] focus:ring-3 focus:ring-blue-100";

function Field({ id, label, type = "text", placeholder, dir }: { id: string; label: string; type?: "text" | "tel" | "email"; placeholder?: string; dir?: "ltr" | "rtl" }) {
  return <div className="min-w-0"><label htmlFor={id} className="mb-2 block text-sm font-bold text-[#243f60]">{label}<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><input id={id} name={id} type={type} dir={dir} required placeholder={placeholder} className={`${inputClass} ${dir === "ltr" ? "text-left" : "text-right"}`} /></div>;
}

function SelectField({ id, label, options }: { id: string; label: string; options: string[] }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-bold text-[#243f60]">{label}<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><select id={id} name={id} required defaultValue="" className={`${inputClass} cursor-pointer text-right`}><option value="" disabled>انتخاب کنید</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4"><span aria-hidden="true" className="h-7 w-1 rounded-full bg-[#2878df]" /><h2 id={id} className="text-xl font-black text-[#16385f] sm:text-2xl">{children}</h2></div>;
}

export default function ResearcherPage() {
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitLock.current) return;
    submitLock.current = true;
    const form = event.currentTarget; setSubmitting(true); setMessage(null);
    try {
      const successMessage = await submitForm("/api/submissions/researcher", form);
      setMessage({ type: "success", text: successMessage || "اطلاعات شما با موفقیت ثبت شد." }); form.reset();
    } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." }); }
    finally { submitLock.current = false; setSubmitting(false); }
  }
  return (
    <main className="min-h-screen bg-[#f1f4f7] px-3 py-5 sm:px-6 sm:py-10">
      <div className="mx-auto w-full min-w-0 max-w-[920px]">
        <header className="mb-7 text-center sm:mb-9">
          <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#41617f] hover:text-[#2878df] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6" /></svg>بازگشت به صفحه اصلی</Link>
          <h1 className="text-3xl font-black leading-snug text-[#12345e] sm:text-[38px]">ثبت‌نام پژوهشگر</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">اطلاعات خود و پروژه پژوهشی پیشنهادی را در فرم زیر وارد کنید.</p>
        </header>

        <form onSubmit={handleSubmit} className="w-full min-w-0 rounded-2xl bg-white px-5 py-7 shadow-[0_12px_45px_rgba(19,45,75,0.08)] sm:px-9 sm:py-10" aria-label="فرم ثبت پروژه پژوهشی">
          <section aria-labelledby="researcher-info-title">
            <SectionHeading id="researcher-info-title">اطلاعات پژوهشگر</SectionHeading>
            <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
              <Field id="fullName" label="نام و نام خانوادگی" placeholder="نام کامل خود را وارد کنید" />
              <Field id="phone" label="شماره تماس" type="tel" dir="ltr" placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
              <Field id="email" label="ایمیل" type="email" dir="ltr" placeholder="name@example.com" />
              <SelectField id="education" label="تحصیلات" options={["کارشناسی", "کارشناسی ارشد", "دکتری", "پسادکتری", "سایر"]} />
              <Field id="university" label="دانشگاه / محل فعالیت" placeholder="نام دانشگاه یا محل فعالیت" />
              <SelectField id="researchField" label="حوزه پژوهشی" options={["هوش مصنوعی", "سلامت", "انرژی‌های تجدیدپذیر", "میکروالکترونیک", "فناوری اطلاعات و ارتباطات", "فین‌تک", "سایر"]} />
              <div className="md:col-span-2 md:max-w-[calc(50%-0.75rem)]"><Field id="specialty" label="تخصص / زمینه تخصصی" placeholder="زمینه تخصصی خود را وارد کنید" /></div>
            </div>
          </section>

          <section className="mt-10 sm:mt-12" aria-labelledby="solution-info-title">
            <SectionHeading id="solution-info-title">اطلاعات پروژه پژوهشی</SectionHeading>
            <div className="space-y-5">
              <Field id="projectTitle" label="عنوان پروژه" placeholder="عنوان پروژه پیشنهادی" />
              <div><label htmlFor="solutionDescription" className="mb-2 block text-sm font-bold text-[#243f60]">شرح پروژه<span aria-hidden="true" className="mr-1 text-red-500">*</span></label><textarea id="solutionDescription" name="solutionDescription" required rows={7} placeholder="شرح مختصری از پروژه پژوهشی خود ارائه دهید" className="min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-base leading-8 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2878df] focus:ring-3 focus:ring-blue-100" /></div>
              <div><label htmlFor="attachment" className="mb-2 block text-sm font-bold text-[#243f60]">فایل پیوست</label><div className="rounded-xl border border-dashed border-[#a9bfd7] bg-[#f8fbfe] px-4 py-6 text-center sm:px-6"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 h-10 w-10 text-[#477aa9]"><path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></svg><p className="mb-3 text-sm font-bold text-[#314f6d]">فایل پیشنهادی خود را انتخاب کنید</p><input id="attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.zip" className="mx-auto block max-w-full text-sm text-slate-600 file:ml-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#e8f1fb] file:px-4 file:py-2 file:font-bold file:text-[#2468ad] hover:file:bg-[#dceafa]" /><p className="mt-4 text-xs leading-6 text-slate-500">فرمت‌های مجاز: PDF، Word و ZIP · حداکثر حجم فایل: ۵۰ مگابایت</p></div></div>
            </div>
          </section>

          <div className="mt-9 border-t border-slate-100 pt-7 text-center"><button type="submit" disabled={submitting} className="h-12 w-full rounded-lg bg-[#2878df] px-8 text-base font-black text-white shadow-sm hover:bg-[#2169c5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto sm:min-w-64">{submitting ? "در حال ثبت..." : "ثبت پروژه پژوهشی"}</button>{message && <p role="status" className={`mt-4 rounded-lg px-4 py-3 text-sm font-bold ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}</div>
        </form>
      </div>
    </main>
  );
}
