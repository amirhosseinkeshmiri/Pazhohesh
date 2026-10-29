import Link from "next/link";

export default function CompanyPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f1f4f7] px-4 py-10 sm:px-6">
      <section className="w-full max-w-2xl rounded-2xl bg-white px-6 py-10 text-center shadow-[0_10px_38px_rgba(19,45,75,0.10)] sm:px-10 sm:py-14">
        <h1 className="text-3xl font-black leading-snug text-[#12345e] sm:text-[38px]">
          پایان مهلت ثبت‌نام شرکت‌ها
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
          مهلت ثبت نیاز پژوهشی شرکت‌ها به پایان رسیده است.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-[#41617f] transition-colors hover:border-[#168b5b] hover:text-[#168b5b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m9 18 6-6-6-6" />
          </svg>
          بازگشت به صفحه اصلی
        </Link>
      </section>
    </main>
  );
}
