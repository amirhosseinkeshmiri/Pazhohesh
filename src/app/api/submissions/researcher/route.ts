import { getPrisma } from "@/lib/prisma";
import { cleanupFiles, optionalFile, saveFile, validateFile } from "@/lib/upload";
import { validateEmail, validateFields, validatePhone } from "@/lib/validation";

export const runtime = "nodejs";

const educationValues = ["کارشناسی", "کارشناسی ارشد", "دکتری", "پسادکتری", "سایر"] as const;
const researchFields = ["هوش مصنوعی", "سلامت", "انرژی‌های تجدیدپذیر", "میکروالکترونیک", "فناوری اطلاعات و ارتباطات", "فین‌تک", "سایر"] as const;

export async function POST(request: Request) {
  const writtenFiles: string[] = [];
  try {
    const form = await request.formData();
    const result = validateFields(form, {
      fullName: { label: "نام و نام خانوادگی", max: 200 },
      phone: { label: "شماره تماس", max: 50 },
      email: { label: "ایمیل", max: 254 },
      education: { label: "تحصیلات", max: 250, allowed: educationValues },
      university: { label: "دانشگاه / محل فعالیت", max: 300 },
      researchField: { label: "حوزه پژوهشی", max: 250, allowed: researchFields },
      specialty: { label: "تخصص", max: 250 },
      projectTitle: { label: "عنوان پروژه", max: 300 },
      solutionDescription: { label: "شرح راهکار", max: 5000 },
    });
    if (result.error || !result.values) return Response.json({ success: false, message: result.error }, { status: 400 });
    const values = result.values;
    if (!validateEmail(values.email)) return Response.json({ success: false, message: "لطفاً یک ایمیل معتبر وارد کنید." }, { status: 400 });
    if (!validatePhone(values.phone)) return Response.json({ success: false, message: "لطفاً یک شماره تماس معتبر وارد کنید." }, { status: 400 });
    const attachment = optionalFile(form, "attachment");
    const fileError = validateFile(attachment, [".pdf", ".doc", ".docx", ".zip"]);
    if (fileError) return Response.json({ success: false, message: fileError }, { status: attachment && attachment.size > 50 * 1024 * 1024 ? 413 : 400 });
    let attachmentPath: string | null = null;
    if (attachment) { const saved = await saveFile(attachment, ["researchers"]); writtenFiles.push(saved.absolutePath); attachmentPath = saved.publicPath; }
    await getPrisma().researcherSubmission.create({ data: {
      fullName: values.fullName, phone: values.phone, email: values.email.toLowerCase(),
      education: values.education, university: values.university, researchField: values.researchField,
      specialty: values.specialty, projectTitle: values.projectTitle,
      solutionDescription: values.solutionDescription, attachmentPath,
    } });
    return Response.json({ success: true, message: "اطلاعات شما با موفقیت ثبت شد." });
  } catch (error) {
    await cleanupFiles(writtenFiles);
    console.error("Researcher submission failed", error);
    return Response.json({ success: false, message: "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
