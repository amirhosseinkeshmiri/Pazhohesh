import { clearAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    await clearAdminSession();
    return Response.redirect(new URL("/admin/login", request.url), 303);
  } catch {
    return Response.json({ success: false, message: "خروج انجام نشد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
