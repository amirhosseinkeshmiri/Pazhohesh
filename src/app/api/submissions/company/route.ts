import { getPrisma } from "@/lib/prisma";
import { cleanupFiles, optionalFile, saveFile, validateFile } from "@/lib/upload";
import { validateEmail, validateFields, validatePhone } from "@/lib/validation";

export const runtime = "nodejs";

const researchFields = ["هوش مصنوعی", "سلامت", "انرژی‌های تجدیدپذیر", "میکروالکترونیک", "فناوری اطلاعات و ارتباطات", "فین‌تک", "سایر"] as const;

export async function POST(request: Request) {
  const writtenFiles: string[] = [];
  try {
    const form = await request.formData();
    const result = validateFields(form, {
      companyName: { label: "نام شرکت", max: 200 }, contactName: { label: "نام تکمیل‌کننده", max: 200 },
      position: { label: "سمت تکمیل‌کننده", max: 250 }, phone: { label: "شماره تماس", max: 50 },
      email: { label: "ایمیل", max: 254 }, completionDate: { label: "تاریخ تکمیل", max: 30 },
      researchNeedTitle: { label: "عنوان نیاز پژوهشی", max: 300 },
      researchField: { label: "حوزه پژوهشی", max: 250, allowed: researchFields },
      problemDescription: { label: "شرح مسئله و نیاز پژوهشی", max: 5000 },
    });
    if (result.error || !result.values) return Response.json({ success: false, message: result.error }, { status: 400 });
    const values = result.values;
    if (!validateEmail(values.email)) return Response.json({ success: false, message: "لطفاً یک ایمیل معتبر وارد کنید." }, { status: 400 });
    if (!validatePhone(values.phone)) return Response.json({ success: false, message: "لطفاً یک شماره تماس معتبر وارد کنید." }, { status: 400 });
    const completionDate = /^\d{4}-\d{2}-\d{2}$/.test(values.completionDate) ? new Date(`${values.completionDate}T00:00:00.000Z`) : new Date(Number.NaN);
    if (Number.isNaN(completionDate.getTime()) || completionDate.toISOString().slice(0, 10) !== values.completionDate) return Response.json({ success: false, message: "تاریخ تکمیل معتبر نیست." }, { status: 400 });
    const attachment = optionalFile(form, "attachment");
    const completedForm = optionalFile(form, "completedForm");
    for (const [file, allowed] of [[attachment, [".pdf", ".doc", ".docx", ".zip"]], [completedForm, [".pdf", ".doc", ".docx"]]] as const) {
      const error = validateFile(file, allowed); if (error) return Response.json({ success: false, message: error }, { status: file && file.size > 50 * 1024 * 1024 ? 413 : 400 });
    }
    let attachmentPath: string | null = null; let completedFormPath: string | null = null;
    if (attachment) { const saved = await saveFile(attachment, ["companies", "attachments"]); writtenFiles.push(saved.absolutePath); attachmentPath = saved.publicPath; }
    if (completedForm) { const saved = await saveFile(completedForm, ["companies", "completed-forms"]); writtenFiles.push(saved.absolutePath); completedFormPath = saved.publicPath; }
    await getPrisma().companySubmission.create({ data: {
      companyName: values.companyName, contactName: values.contactName, position: values.position,
      phone: values.phone, email: values.email.toLowerCase(), completionDate,
      researchNeedTitle: values.researchNeedTitle, researchField: values.researchField,
      problemDescription: values.problemDescription, attachmentPath, completedFormPath,
    } });
    return Response.json({ success: true, message: "نیاز پژوهشی شما با موفقیت ثبت شد." });
  } catch (error) {
    await cleanupFiles(writtenFiles); console.error("Company submission failed", error);
    return Response.json({ success: false, message: "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
