const TEMPORARY_DATABASE_CODES = new Set(["P1001", "P1002", "P1008", "P1017"]);

export function databaseErrorCode(error: unknown) {
  const code = prismaErrorCode(error);
  return typeof code === "string" && TEMPORARY_DATABASE_CODES.has(code) ? code : null;
}

export function prismaErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && /^P\d{4}$/.test(code) ? code : null;
}

export function safeErrorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}
