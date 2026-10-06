"use client";

import { useState } from "react";
import { SOURCE_LABEL, VERDICTS, type Match, type VerifyResult } from "@/lib/api";
import { VerdictBadge } from "./ui";
import { arNum, cn } from "@/lib/cn";

function MatchBody({ m }: { m: Match }) {
  const [showGrades, setShowGrades] = useState(false);
  return (
    <>
      <dl className="mt-5 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2">
        {m.narrator && <Row k="الراوي" v={m.narrator.replace(/^\[|\]$/g, "")} />}
        {m.muhaddith && <Row k="المحدّث" v={m.muhaddith} />}
        {m.source_book && <Row k="المصدر" v={m.source_book} />}
        {m.number_or_page && <Row k="الصفحة أو الرقم" v={arNum(m.number_or_page)} />}
        {m.grade_text && <Row k="خلاصة حكم المحدّث" v={m.grade_text} wide />}
      </dl>
      {m.grades.length > 1 && (
        <div className="mt-5">
          <button
            onClick={() => setShowGrades((v) => !v)}
            className="text-sm font-semibold text-brand-700 hover:underline"
            aria-expanded={showGrades}
          >
            {showGrades ? "إخفاء" : "عرض"} أحكام المحدّثين ({arNum(m.grades.length)})
          </button>
          {showGrades && (
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {m.grades.map((g, i) => (
                <li key={i} className="flex items-center justify-between gap-4 bg-paper/60 px-4 py-3 text-sm">
                  <span>
                    <strong className="text-night-700">{g.scholar ?? "—"}</strong>
                    <span className="text-muted">: {g.grade}</span>
                  </span>
                  <VerdictBadge code={g.verdict_code} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

function Row({ k, v, wide }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={cn("flex gap-2", wide && "sm:col-span-2")}>
      <dt className="shrink-0 font-semibold text-night-700">{k}:</dt>
      <dd className="text-ink/80">{v}</dd>
    </div>
  );
}

export function ResultCard({ r }: { r: VerifyResult }) {
  const [copied, setCopied] = useState(false);

  if (r.status !== "found" || !r.best_match) {
    const tone = r.status === "unavailable" ? "border-daif/40" : "border-unclear/40";
    return (
      <div className={cn("card animate-fade-up overflow-hidden border-s-4", tone)}>
        <div className="flex items-start gap-4 p-7">
          <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-unclear/15 text-unclear">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
          </span>
          <div>
            <h2 className="text-xl font-bold text-night-700">
              {r.status === "not_found" ? "لم نعثر على هذا النص بثقة كافية" : r.status === "unavailable" ? "المصادر غير متاحة حالياً" : "خارج نطاق التحقق"}
            </h2>
            <p className="mt-2 leading-8 text-muted">{r.message_ar}</p>
            {r.status === "not_found" && (
              <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm leading-7 text-ink/80">
                عدم العثور على النص لا يعني أنه صحيح ولا أنه مكذوب. تصحيح يمتنع عن التخمين ويحيلك إلى أهل العلم.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const m = r.best_match;
  const v = VERDICTS[r.verdict_code ?? "unclear"] ?? VERDICTS.unclear;
  const share = `${m.hadith_text}\n\nالحكم: ${r.verdict_ar ?? v.label}${m.muhaddith ? ` — ${m.muhaddith}` : ""}${m.source_book ? `\nالمصدر: ${m.source_book}` : ""}\n\nتحقّق عبر تصحيح: https://tashihweb.diagnify-ai.com`;

  return (
    <article className="animate-fade-up">
      <div className="rounded-t-2xl bg-night-700 px-7 py-5 text-white shadow-lg">
        <p className="hadith text-xl sm:text-2xl">{m.hadith_text}</p>
      </div>
      <div className="card rounded-t-none border-t-0 p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-night-700">حكم الحديث</h2>
          <VerdictBadge code={r.verdict_code} label={r.verdict_ar} size="lg" />
        </div>
        <p className="mt-2 text-sm font-medium text-muted">{v.note}</p>

        {r.scholars_differ && (
          <p className="mt-4 rounded-xl border border-daif/30 bg-daif/10 px-4 py-3 text-sm leading-7 text-amber-900">
            اختلفت أحكام المحدّثين على هذا النص؛ اطّلع على جميع الأحكام أدناه، ولا يُعدّ حكم واحد منها إجماعاً.
          </p>
        )}

        <MatchBody m={m} />

        {r.explanation_ar && (
          <div className="mt-6 rounded-xl bg-mint-400/10 p-5 leading-8">
            <p className="mb-1 text-sm font-bold text-brand-700">شرح مبسّط (مبني على النتيجة المسترجعة)</p>
            {r.explanation_ar}
          </div>
        )}

        <p className="mt-6 leading-8 text-ink/80">{r.message_ar}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button
            onClick={() => navigator.clipboard.writeText(share).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            {copied ? "تم النسخ ✓" : "نسخ مع الحكم والمصدر"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(share)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-5 py-2 text-sm font-bold text-night-700 hover:border-brand-500"
          >
            مشاركة عبر واتساب
          </a>
          <span className="ms-auto text-xs text-muted">
            المصدر: {SOURCE_LABEL[r.source_used ?? ""] ?? r.source_used}
          </span>
        </div>
        <p className="mt-4 text-xs text-muted">{r.disclaimer_ar}</p>
      </div>

      {r.other_matches.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 font-bold text-night-700">روايات وطرق أخرى ({arNum(r.other_matches.length)})</h2>
          <div className="grid gap-4">
            {r.other_matches.map((o, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="hadith text-lg text-ink">{o.hadith_text}</p>
                  {o.grades[0] && <VerdictBadge code={o.grades[0].verdict_code} size="sm" />}
                </div>
                <MatchBody m={o} />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
