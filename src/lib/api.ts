export type VerdictCode = "sahih" | "hasan" | "daif" | "mawdu" | "unclear";
export type Status = "found" | "not_found" | "out_of_scope" | "unavailable";

export interface Grade {
  scholar: string | null;
  grade: string;
  verdict_code: VerdictCode;
}

export interface Match {
  hadith_text: string;
  narrator: string | null;
  muhaddith: string | null;
  source_book: string | null;
  number_or_page: string | null;
  grade_text: string | null;
  grades: Grade[];
  match_score: number;
}

export interface VerifyResult {
  request_id: string;
  status: Status;
  verdict_code: VerdictCode | null;
  verdict_ar: string | null;
  query: string;
  best_match: Match | null;
  other_matches: Match[];
  explanation_ar: string | null;
  message_ar: string;
  disclaimer_ar: string;
  refer_to_scholars: boolean;
  scholars_differ: boolean;
  source_used: string | null;
  reply_ar?: string;
}

export interface Prayer {
  key: string;
  name_ar: string;
  time: string;
  is_prayer: boolean;
}

export interface PrayerTimes {
  date: string;
  timezone: string;
  method: { id: number; name: string };
  hijri: { day: number; month_ar: string; year: number; weekday_ar: string };
  is_friday: boolean;
  prayers: Prayer[];
  next_prayer: { key: string; name_ar: string; time: string } | null;
}

export interface Qibla {
  direction_deg: number;
  compass_ar: string;
}

export interface Daily {
  date: string;
  hadith: {
    hadith_text: string;
    source_book: string;
    number: string;
    verdict_code: VerdictCode;
    verdict_ar: string;
    grade_text: string;
  };
  disclaimer_ar: string;
}

/** Browser calls go through the Next.js rewrite; server calls hit the API directly. */
export const API_BASE =
  typeof window === "undefined" ? `${process.env.TASHIH_API_URL ?? "http://127.0.0.1:8010"}/v1` : "/api/v1";

export class ApiError extends Error {}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("تعذّر الاتصال بالخادم. تحقّق من اتصالك ثم أعد المحاولة.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error?.message_ar ?? "حدث خطأ غير متوقع. حاول مرة أخرى.");
  }
  return res.json() as Promise<T>;
}

export const api = {
  verify: (text: string, max_results = 5) =>
    call<VerifyResult>("/verify", { method: "POST", body: JSON.stringify({ text, max_results }) }),
  chat: (messages: { role: "user" | "assistant"; content: string }[]) =>
    call<VerifyResult>("/chat", { method: "POST", body: JSON.stringify({ messages }) }),
  prayerTimes: (lat: number, lon: number, method?: number) =>
    call<PrayerTimes>(`/prayer/times?lat=${lat}&lon=${lon}${method ? `&method=${method}` : ""}`),
  qibla: (lat: number, lon: number) => call<Qibla>(`/prayer/qibla?lat=${lat}&lon=${lon}`),
  daily: () => call<Daily>("/daily"),
};

export const VERDICTS: Record<VerdictCode, { label: string; color: string; soft: string; note: string }> = {
  sahih: { label: "صحيح", color: "bg-sahih", soft: "bg-sahih/10 text-brand-700 ring-sahih/30", note: "مقبول يُحتجّ به" },
  hasan: { label: "حسن", color: "bg-sahih", soft: "bg-sahih/10 text-brand-700 ring-sahih/30", note: "مقبول يُحتجّ به" },
  daif: { label: "ضعيف", color: "bg-daif", soft: "bg-daif/10 text-amber-800 ring-daif/30", note: "لا ينبغي نسبته إلى النبي ﷺ" },
  mawdu: { label: "موضوع", color: "bg-mawdu", soft: "bg-mawdu/10 text-red-800 ring-mawdu/30", note: "مكذوب، لا تجوز نسبته إلى النبي ﷺ" },
  unclear: { label: "يحتاج مراجعة", color: "bg-unclear", soft: "bg-unclear/10 text-neutral-700 ring-unclear/30", note: "عبارة المحدّث تحتاج إلى نظر أهل العلم" },
};

export const SOURCE_LABEL: Record<string, string> = {
  dorar: "الموسوعة الحديثية — الدرر السنية",
  offline_six_books: "الكتب الستة (قاعدة بيانات مفتوحة)",
};
