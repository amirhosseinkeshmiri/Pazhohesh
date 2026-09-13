import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_SECONDS = 10 * 60 * 60;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function credentialsAreValid(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) throw new Error("Admin credentials are not configured.");
  return safeEqual(sign(username), sign(expectedUsername)) && safeEqual(sign(password), sign(expectedPassword));
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin:${expires}`;
  (await cookies()).set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: SESSION_SECONDS,
  });
}

export async function verifyAdminSession() {
  try {
    const value = (await cookies()).get(COOKIE_NAME)?.value;
    if (!value) return false;
    const lastDot = value.lastIndexOf("."); if (lastDot < 0) return false;
    const payload = value.slice(0, lastDot); const signature = value.slice(lastDot + 1);
    const [role, expiresText] = payload.split(":");
    const expires = Number(expiresText);
    return role === "admin" && Number.isSafeInteger(expires) && expires > Math.floor(Date.now() / 1000) && safeEqual(signature, sign(payload));
  } catch { return false; }
}

export async function clearAdminSession() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 0 });
}
