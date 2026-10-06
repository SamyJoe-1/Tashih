export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function arNum(n: number | string) {
  return String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}
