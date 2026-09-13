import { verifyAdminSession } from "@/lib/admin-auth";
import {
  createExcelExport,
  EXCEL_CONTENT_TYPE,
  publicUploadPath,
  type ExportColumn,
} from "@/lib/excel-export";
import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode, safeErrorName } from "@/lib/submission-errors";

export const runtime = "nodejs";

const columns: ExportColumn[] = [
  { header: "ردیف", key: "rowNumber", width: 8 },
  { header: "شناسه", key: "id", width: 28 },
  { header: "نام شرکت", key: "companyName", width: 28 },
  { header: "نام و نام خانوادگی مدیرعامل / تکمیل‌کننده", key: "contactName", width: 36 },
  { header: "سمت تکمیل‌کننده", key: "position", width: 24 },
  { header: "شماره تماس", key: "phone", width: 18 },
  { header: "ایمیل", key: "email", width: 30 },
  { header: "تاریخ تکمیل", key: "completionDate", width: 16, numberFormat: "yyyy-mm-dd" },
  { header: "عنوان نیاز پژوهشی", key: "researchNeedTitle", width: 36, wrap: true },
  { header: "حوزه پژوهشی", key: "researchField", width: 24 },
  { header: "شرح مسئله و نیاز پژوهشی", key: "problemDescription", width: 60, wrap: true },
  { header: "فایل پیوست", key: "attachmentPath", width: 42 },
  { header: "فرم تکمیل‌شده", key: "completedFormPath", width: 42 },
  { header: "تاریخ ثبت", key: "createdAt", width: 20, numberFormat: "yyyy-mm-dd hh:mm" },
  { header: "آخرین بروزرسانی", key: "updatedAt", width: 20, numberFormat: "yyyy-mm-dd hh:mm" },
];

export async function GET() {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "دسترسی غیرمجاز است." }, { status: 401 });
  }

  try {
    const submissions = await getPrisma().companySubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    const buffer = await createExcelExport(
      "نیازهای پژوهشی",
      columns,
      submissions.map((submission, index) => ({
        rowNumber: index + 1,
        id: submission.id,
        companyName: submission.companyName,
        contactName: submission.contactName,
        position: submission.position,
        phone: submission.phone,
        email: submission.email,
        completionDate: submission.completionDate,
        researchNeedTitle: submission.researchNeedTitle,
        researchField: submission.researchField,
        problemDescription: submission.problemDescription,
        attachmentPath: publicUploadPath(submission.attachmentPath),
        completedFormPath: publicUploadPath(submission.completedFormPath),
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      })),
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="company-research-needs.xlsx"',
        "Content-Type": EXCEL_CONTENT_TYPE,
      },
    });
  } catch (error) {
    console.warn(`[admin] company export failed (${prismaErrorCode(error) ?? safeErrorName(error)})`);
    return Response.json(
      { error: "ساخت فایل اکسل با خطا مواجه شد. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
