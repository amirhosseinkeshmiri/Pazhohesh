"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const submitLock = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitLock.current) return; submitLock.current = true; setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: form.get("username"), password: form.get("password") }) });
      const data = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !data.success) throw new Error(data.message || "ورود انجام نشد.");
      router.replace("/admin"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "ورود انجام نشد. لطفاً دوباره تلاش کنید."); }
    finally { submitLock.current = false; setLoading(false); }
  }
  return <form onSubmit={submit} className="mt-7 space-y-5"><div><label htmlFor="username" className="mb-2 block text-sm font-bold text-[#243f60]">نام کاربری</label><input id="username" name="username" autoComplete="username" required className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#2878df] focus:ring-3 focus:ring-blue-100" /></div><div><label htmlFor="password" className="mb-2 block text-sm font-bold text-[#243f60]">رمز عبور</label><input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 w-full rounded-lg border border-slate-200 px-4 outline-none focus:border-[#2878df] focus:ring-3 focus:ring-blue-100" /></div><button disabled={loading} className="h-12 w-full rounded-lg bg-[#2878df] font-black text-white disabled:opacity-60">{loading ? "در حال ورود..." : "ورود"}</button>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-center text-sm font-bold text-red-700">{error}</p>}</form>;
}
