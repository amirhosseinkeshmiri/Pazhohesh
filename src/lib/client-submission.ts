const SUBMISSION_TIMEOUT_MS = 18_000;
const GENERIC_ERROR = "خطایی در ثبت اطلاعات رخ داد. لطفاً دوباره تلاش کنید.";
const TIMEOUT_ERROR = "ارتباط با سرور بیش از حد طول کشید. لطفاً دوباره تلاش کنید.";

type SubmissionResponse = { success?: boolean; message?: string };

export async function submitForm(url: string, form: HTMLFormElement) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new FormData(form),
      signal: controller.signal,
    });
    const text = await response.text();
    let data: SubmissionResponse | null = null;
    try {
      data = text ? JSON.parse(text) as SubmissionResponse : null;
    } catch {
      data = null;
    }

    if (!data || typeof data !== "object") throw new Error(GENERIC_ERROR);
    if (!response.ok || !data.success) throw new Error(data.message || GENERIC_ERROR);
    return data.message;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error(TIMEOUT_ERROR);
    if (error instanceof Error && error.message !== "Failed to fetch") throw error;
    throw new Error(GENERIC_ERROR);
  } finally {
    window.clearTimeout(timeout);
  }
}
