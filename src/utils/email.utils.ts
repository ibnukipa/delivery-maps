const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (value: string): string | null => {
  if (!value) return null;
  if (!value.includes("@")) return "Missing @ symbol";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
  return null;
};
