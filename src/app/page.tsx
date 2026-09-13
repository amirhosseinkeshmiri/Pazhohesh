import Link from "next/link";
import type { ReactNode } from "react";

function Icon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    researcher: <><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12.5V17c3 2.7 7 2.7 10 0v-4.5M21 10v6"/></>,
    company: <><path d="M4 21V8l8-4v17M12 10h8v11M8 9v.01M8 13v.01M8 17v.01M16 14v.01M16 18v.01M3 21h18"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    network: <><circle cx="12" cy="5" r="3"/><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="m10.5 7.6-4 7M13.5 7.6l4 7M8 18h8"/></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12M16 12h6v4h-6a2 2 0 0 1 0-4Z"/></>,
    ai: <><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9v6M15 9v6M9 12h6M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M19 9h3M2 15h3M19 15h3"/></>,
    health: <><path d="M12 21s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.2-8 11-8 11ZM8 13h2l1-3 2 6 1-3h2"/></>,
    energy: <path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z"/>,
    chip: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M18 9h4M2 15h4M18 15h4"/></>,
    ict: <><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9h10M7 12h6"/></>,
    fintech: <><path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M10 7h4"/></>,
    bulb: <><path d="M9 18h6M10 22h4M8.3 15.5a7 7 0 1 1 7.4 0c-.9.6-1.2 1.3-1.2 2.5h-5c0-1.2-.3-1.9-1.2-2.5Z"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}

const benefits = [["book", <>دسترسی به<br/>ظرفیت علمی</>], ["target", <>حل مسائل واقعی<br/>و کاربردی</>], ["network", <>همکاری و شبکه‌سازی<br/>با پژوهشگران</>], ["wallet", <>امکان استفاده از<br/>حمایت مالی پارک</>]] as const;
const fields = [["ai", "هوش مصنوعی"], ["health", "سلامت"], ["energy", "انرژی‌های تجدیدپذیر"], ["chip", "میکروالکترونیک"], ["ict", "فناوری اطلاعات و ارتباطات"], ["fintech", "فین‌تک"]] as const;

function PartnerLogos() {
  return <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 sm:gap-7" aria-label="نشان همکاران برنامه">{["پارک علم و فناوری", "دانشگاه", "مرکز نوآوری"].map((label, index) => <div key={label} className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2 text-center text-[11px] font-bold text-slate-500 sm:h-16 sm:text-sm"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${index === 1 ? "bg-[#1e9b62]" : "bg-[#173d70]"} text-xs text-white`}>{index + 1}</span><span>{label}</span></div>)}</div>;
}

function RoleCard({ kind, title, description, href, action }: { kind: "researcher" | "company"; title: string; description: ReactNode; href: string; action: string }) {
  const blue = kind === "researcher";
  return <article className="flex min-h-72 flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-[0_10px_30px_rgba(18,52,86,0.05)]"><div className={`grid h-16 w-16 place-items-center rounded-full ${blue ? "bg-blue-50 text-[#2272dc]" : "bg-emerald-50 text-[#159765]"}`}><Icon name={kind} className="h-9 w-9"/></div><h3 className="mt-4 text-xl font-extrabold text-[#14345f]">{title}</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">{description}</p><Link href={href} className={`mt-auto min-w-44 rounded-lg px-6 py-2.5 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${blue ? "bg-[#2878df] hover:bg-[#2168c4] focus-visible:outline-blue-600" : "bg-[#1a9b68] hover:bg-[#16855a] focus-visible:outline-emerald-600"}`}>{action}</Link></article>;
}

export default function Home() {
  return <main className="landing-shell px-3 py-4 sm:px-6 sm:py-8"><div className="mx-auto w-full min-w-0 max-w-[1040px] overflow-hidden rounded-[22px] bg-white px-5 py-9 shadow-[0_12px_45px_rgba(19,45,75,0.08)] sm:px-10 sm:py-12 lg:px-[72px]">
    <header className="text-center"><h1 className="text-3xl font-black leading-snug text-[#12345e] sm:text-[42px]">حمایت از پژوهش‌های کاربردی</h1><div className="mt-7"><PartnerLogos/></div></header>
    <section className="hero-tech relative mt-9 flex aspect-[16/7] min-h-60 overflow-hidden rounded-2xl px-5 pb-7 text-center text-white sm:min-h-80 sm:pb-9" aria-label="معرفی برنامه Research Pitch"><div className="relative z-10 mt-auto w-full"><button type="button" aria-label="پخش ویدیوی معرفی (به‌زودی)" className="mx-auto mb-5 grid h-16 w-16 cursor-default place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm"><svg aria-hidden="true" viewBox="0 0 24 24" className="mr-1 h-7 w-7 fill-white"><path d="m8 5 11 7-11 7V5Z"/></svg></button><p className="text-2xl font-black tracking-[0.12em] sm:text-3xl">RESEARCH PITCH</p><p className="mt-1 text-sm text-blue-100 sm:text-base">حمایت از پژوهش‌های کاربردی</p></div></section>
    <p className="mx-auto mt-9 max-w-3xl text-center text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">برنامه حمایت از پژوهش‌های کاربردی، با هدف شناسایی نیازهای پژوهشی و فناوری<br className="hidden sm:block"/> شرکت‌ها و اتصال آن‌ها به ظرفیت علمی دانشگاه‌ها و پژوهشگران برگزار می‌شود.</p>
    <section className="mt-12" aria-labelledby="roles-title"><h2 id="roles-title" className="section-title">شما در این برنامه چه نقشی دارید؟</h2><div className="mt-7 grid gap-5 md:grid-cols-2"><RoleCard kind="researcher" title="من پژوهشگر هستم" description={<>برای حل مسائل واقعی شرکت‌ها،<br/>راهکار پژوهشی خود را ارائه دهید.</>} href="/researcher" action="ثبت نام پژوهشگر"/><RoleCard kind="company" title="من شرکت هستم" description={<>نیاز پژوهشی یا چالش فناورانه<br/>خود را ثبت کنید.</>} href="/company" action="ثبت نیاز پژوهشی"/></div></section>
    <section className="mt-14" aria-labelledby="benefits-title"><h2 id="benefits-title" className="section-title">چرا در این برنامه شرکت کنیم؟</h2><div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">{benefits.map(([icon, label]) => <div key={icon} className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-50 text-[#2d6cae]"><Icon name={icon}/></div><p className="mt-3 text-sm font-bold leading-6 text-[#244363] sm:text-[15px]">{label}</p></div>)}</div></section>
    <section className="mt-14" aria-labelledby="fields-title"><h2 id="fields-title" className="section-title">حوزه‌های تخصصی</h2><div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">{fields.map(([icon, label]) => <div key={label} className="text-center"><div className="mx-auto grid h-[74px] w-[74px] place-items-center rounded-full bg-[#f2f7fc] text-[#316fae]"><Icon name={icon} className="h-8 w-8"/></div><p className="mx-auto mt-3 max-w-32 text-sm font-bold leading-6 text-[#244363]">{label}</p></div>)}</div></section>
    <section className="funding-banner mt-14 overflow-hidden rounded-2xl px-6 py-8 text-white sm:px-10 sm:py-9" aria-label="میزان حمایت مالی"><div className="relative z-10 grid items-center gap-7 text-center sm:grid-cols-[1fr_auto_1.35fr] sm:text-right"><div><p className="text-4xl font-black text-[#ffd54a] sm:text-5xl">تا ۷۰٪</p><p className="mt-2 text-sm font-medium text-blue-50 sm:text-base">حمایت از هزینه اجرای پروژه</p></div><div className="hidden h-20 w-px bg-white/20 sm:block"/><div className="flex flex-col items-center gap-4 sm:flex-row sm:text-right"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/10 text-[#ffd54a]"><Icon name="bulb" className="h-9 w-9"/></div><div><p className="text-2xl font-black text-[#ffd54a] sm:text-3xl">تا سقف ۱ میلیارد تومان</p><p className="mt-2 text-sm leading-7 text-blue-50">برای پروژه‌های منتخب و مطابق ضوابط برنامه</p></div></div></div></section>
  </div></main>;
}
