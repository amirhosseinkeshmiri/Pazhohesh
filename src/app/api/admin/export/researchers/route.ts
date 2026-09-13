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
  { header: "نام و نام خانوادگی", key: "fullName", width: 24 },
  { header: "شماره تماس", key: "phone", width: 18 },
  { header: "ایمیل", key: "email", width: 30 },
  { header: "تحصیلات", key: "education", width: 20 },
  { header: "دانشگاه / محل فعالیت", key: "university", width: 28 },
  { header: "حوزه پژوهشی", key: "researchField", width: 24 },
  { header: "تخصص / زمینه تخصصی", key: "specialty", width: 28 },
  { header: "عنوان پروژه / راهکار پژوهشی", key: "projectTitle", width: 36, wrap: true },
  { header: "شرح راهکار", key: "solutionDescription", width: 60, wrap: true },
  { header: "فایل پیوست", key: "attachmentPath", width: 42 },
  { header: "تاریخ ثبت", key: "createdAt", width: 20, numberFormat: "yyyy-mm-dd hh:mm" },
  { header: "آخرین بروزرسانی", key: "updatedAt", width: 20, numberFormat: "yyyy-mm-dd hh:mm" },
];

export async function GET() {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "دسترسی غیرمجاز است." }, { status: 401 });
  }

  try {
    const submissions = await getPrisma().researcherSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    const buffer = await createExcelExport(
      "پژوهشگران",
      columns,
      submissions.map((submission, index) => ({
        rowNumber: index + 1,
        id: submission.id,
        fullName: submission.fullName,
        phone: submission.phone,
        email: submission.email,
        education: submission.education,
        university: submission.university,
        researchField: submission.researchField,
        specialty: submission.specialty,
        projectTitle: submission.projectTitle,
        solutionDescription: submission.solutionDescription,
        attachmentPath: publicUploadPath(submission.attachmentPath),
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      })),
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="researchers.xlsx"',
        "Content-Type": EXCEL_CONTENT_TYPE,
      },
    });
  } catch (error) {
    console.warn(`[admin] researcher export failed (${prismaErrorCode(error) ?? safeErrorName(error)})`);
    return Response.json(
      { error: "ساخت فایل اکسل با خطا مواجه شد. لطفاً دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
