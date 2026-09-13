type Rule = { label: string; max: number; allowed?: readonly string[] };

export function validateFields(form: FormData, rules: Record<string, Rule>) {
  const values: Record<string, string> = {};
  for (const [name, rule] of Object.entries(rules)) {
    const entry = form.get(name);
    const value = typeof entry === "string" ? entry.trim() : "";
    if (!value) return { error: `لطفاً فیلد «${rule.label}» را تکمیل کنید.` };
    if (value.length > rule.max) return { error: `مقدار فیلد «${rule.label}» بیش از حد مجاز است.` };
    if (rule.allowed && !rule.allowed.includes(value)) return { error: `مقدار فیلد «${rule.label}» معتبر نیست.` };
    values[name] = value;
  }
  return { values };
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return /^[0-9+()\-\s]{5,50}$/.test(phone);
}
