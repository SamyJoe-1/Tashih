"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, type VerifyResult } from "@/lib/api";
import { SearchBox } from "@/components/SearchBox";
import { ResultCard } from "@/components/ResultCard";

const TIPS = [
  "اكتب أوضح جزء من متن الحديث، ولا يلزم كتابة الإسناد.",
  "لا حاجة للتشكيل؛ يُزال تلقائياً قبل البحث.",
  "عبارات مثل «قال رسول الله ﷺ» تُحذف تلقائياً.",
  "إذا كانت العبارة قصيرة جداً أو عامة قد لا تُطابق بثقة.",
];

export function Verifier({ initial }: { initial: string }) {
  const router = useRouter();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(initial));

  const run = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await api.verify(text));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }, []);

  // The page is keyed by the query, so this runs once per search with fresh state.
  useEffect(() => {
    if (!initial) return;
    let alive = true;
    api
      .verify(initial)
      .then((r) => alive && setResult(r))
      .catch((e) => alive && setError(e instanceof ApiError ? e.message : "حدث خطأ غير متوقع."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [initial]);

  return (
    <div className="pattern-light">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <SearchBox
            initial={initial}
            autoFocus={!initial}
            onSearch={(t) => {
              if (t === initial) run(t);
              else router.push(`/verify?q=${encodeURIComponent(t)}`, { scroll: false });
            }}
          />
          <div className="mt-10" aria-live="polite">
            {loading && <Skeleton />}
            {error && (
              <div className="card border-s-4 border-mawdu/50 p-6">
                <p className="font-semibold text-mawdu">{error}</p>
                <button onClick={() => run(initial)} className="mt-3 text-sm font-bold text-brand-700 hover:underline">
                  إعادة المحاولة
                </button>
              </div>
            )}
            {result && <ResultCard r={result} />}
            {!loading && !error && !result && (
              <div className="card grid place-items-center p-14 text-center">
                <div className="grid size-16 place-items-center rounded-2xl bg-brand-500/10 text-3xl">📖</div>
                <p className="mt-4 text-lg font-semibold text-night-700">ابدأ بكتابة نص الحديث في الأعلى</p>
                <p className="mt-1 text-muted">ستظهر هنا درجة الحديث ومصدره وأحكام المحدّثين.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-night-700">نصائح للبحث</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-2"><span className="text-brand-600">◆</span>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-night-700 p-6 text-white">
            <h2 className="font-bold text-mint-300">قاعدتنا</h2>
            <p className="mt-2 text-sm leading-7 text-white/80">الحكم يأتي من المصدر الحديثي دائماً، ولا يُصدر النموذج حكماً من عنده.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse" aria-label="جارٍ البحث">
      <div className="h-20 rounded-t-2xl bg-night-700/80" />
      <div className="card space-y-4 rounded-t-none p-7">
        <div className="flex justify-between"><div className="h-5 w-28 rounded bg-line" /><div className="h-9 w-24 rounded-full bg-line" /></div>
        <div className="h-4 w-2/3 rounded bg-line" />
        <div className="h-4 w-1/2 rounded bg-line" />
        <div className="h-4 w-3/4 rounded bg-line" />
      </div>
      <p className="mt-4 text-center text-sm text-muted">جارٍ البحث في الموسوعة الحديثية...</p>
    </div>
  );
}
