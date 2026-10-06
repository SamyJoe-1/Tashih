import Link from "next/link";
import { API_BASE, type Daily } from "@/lib/api";
import { VerdictBadge } from "./ui";
import { arNum } from "@/lib/cn";

export async function getDaily(): Promise<Daily | null> {
  try {
    const res = await fetch(`${API_BASE}/daily`, { next: { revalidate: 1800 } });
    return res.ok ? ((await res.json()) as Daily) : null;
  } catch {
    return null;
  }
}

/** Split the isnad from the matn at the first «قال رسول الله ...» quote when present. */
function splitMatn(text: string) {
  const i = text.search(/["«]/);
  if (i > 0) return { isnad: text.slice(0, i).trim(), matn: text.slice(i).replace(/["«»]/g, "").trim() };
  return { isnad: "", matn: text };
}

export function DailyCard({ d, compact = false }: { d: Daily; compact?: boolean }) {
  const { isnad, matn } = splitMatn(d.hadith.hadith_text);
  return (
    <article className="card relative overflow-hidden">
      <div className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-mint-400 to-brand-700" />
      <div className="p-8 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-brand-600">{d.hadith.source_book} — رقم {arNum(d.hadith.number)}</span>
          <VerdictBadge code={d.hadith.verdict_code} label={d.hadith.verdict_ar} />
        </div>
        <p className="hadith mt-6 text-2xl text-night-700 sm:text-3xl">«{matn}»</p>
        {isnad && !compact && <p className="hadith mt-6 border-t border-line pt-5 text-base text-muted">{isnad}</p>}
        <p className="mt-6 text-xs text-muted">{d.disclaimer_ar}</p>
        {compact && (
          <Link href="/daily" className="mt-4 inline-block text-sm font-bold text-brand-700 hover:underline">
            اقرأه بإسناده ←
          </Link>
        )}
      </div>
    </article>
  );
}
