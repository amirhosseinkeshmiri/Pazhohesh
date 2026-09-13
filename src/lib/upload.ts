import { randomUUID } from "node:crypto";
import { access, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MIME_BY_EXTENSION: Record<string, readonly string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword", "application/octet-stream"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"],
  ".zip": ["application/zip", "application/x-zip-compressed", "application/octet-stream"],
};

export function optionalFile(form: FormData, name: string) {
  const entry = form.get(name);
  return entry instanceof File && entry.size > 0 ? entry : null;
}

export function validateFile(file: File | null, allowed: readonly string[]) {
  if (!file) return null;
  if (file.size > MAX_FILE_SIZE) return "حجم فایل نباید بیشتر از ۵۰ مگابایت باشد.";
  const extension = path.extname(file.name).toLowerCase();
  if (!allowed.includes(extension)) return "فرمت فایل انتخاب‌شده مجاز نیست.";
  const allowedMimes = MIME_BY_EXTENSION[extension] ?? [];
  if (file.type && !allowedMimes.includes(file.type)) return "نوع فایل انتخاب‌شده با فرمت آن مطابقت ندارد.";
  return null;
}

export async function saveFile(file: File, directory: readonly string[]) {
  if (directory.length === 0 || directory.some((segment) => !/^[a-z0-9-]+$/i.test(segment))) {
    throw new Error("Invalid upload directory.");
  }
  const extension = path.extname(file.name).toLowerCase();
  const filename = `${randomUUID()}${extension}`;
  const uploadRoot = path.join(process.cwd(), "public", "uploads");
  const absoluteDirectory = path.join(uploadRoot, ...directory);
  if (!absoluteDirectory.startsWith(`${uploadRoot}${path.sep}`)) throw new Error("Invalid upload path.");
  await mkdir(absoluteDirectory, { recursive: true });
  const absolutePath = path.join(absoluteDirectory, filename);
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return { absolutePath, publicPath: `/uploads/${directory.join("/")}/${filename}` };
}

export async function cleanupFiles(paths: string[]) {
  const results = await Promise.allSettled(paths.map((filePath) => unlink(filePath)));
  const failures = results.filter((result) => result.status === "rejected").length;
  if (failures > 0) console.warn(`[upload] cleanup failed for ${failures} file(s)`);
}

export function safeUploadPath(value: string | null) {
  return value && /^\/uploads\/[a-z0-9/_-]+\.(pdf|doc|docx|zip)$/i.test(value) ? value : null;
}

export async function existingUploadPath(value: string | null) {
  const safePath = safeUploadPath(value);
  if (!safePath) return null;
  const uploadRoot = path.join(process.cwd(), "public", "uploads");
  const absolutePath = path.join(process.cwd(), "public", safePath.slice(1));
  if (!absolutePath.startsWith(`${uploadRoot}${path.sep}`)) return null;
  try {
    await access(absolutePath);
    return safePath;
  } catch {
    return null;
  }
}
