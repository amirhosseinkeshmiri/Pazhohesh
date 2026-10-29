export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { success: false, message: "مهلت ثبت‌نام شرکت‌ها به پایان رسیده است." },
    { status: 410 },
  );
}
