import { createAdminSession, credentialsAreValid } from "@/lib/admin-auth";
import { safeErrorName } from "@/lib/submission-errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: unknown; password?: unknown };
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!credentialsAreValid(username, password)) return Response.json({ success: false, message: "نام کاربری یا رمز عبور اشتباه است." }, { status: 401 });
    await createAdminSession();
    return Response.json({ success: true });
  } catch (error) {
    console.error(`[admin] login failed (${safeErrorName(error)})`);
    return Response.json({ success: false, message: "ورود انجام نشد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
