"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError, type VerifyResult } from "@/lib/api";
import { ResultCard } from "@/components/ResultCard";
import { Logo } from "@/components/Logo";

type Msg = { role: "user"; content: string } | { role: "assistant"; content: string; result?: VerifyResult };

const STARTERS = [
  "ما صحة حديث: اطلبوا العلم ولو في الصين؟",
  "هل حديث «النظافة من الإيمان» صحيح؟",
  "وصلني على واتساب: من قال سبحان الله وبحمده مائة مرة حُطّت خطاياه",
  "ما درجة حديث: خيركم من تعلم القرآن وعلمه",
];

export function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgs.length > 0 || busy) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const r = await api.chat(next.map((m) => ({ role: m.role, content: m.content })).slice(-20));
      setMsgs([...next, { role: "assistant", content: r.reply_ar ?? r.message_ar, result: r.status === "found" ? r : undefined }]);
    } catch (e) {
      setMsgs([...next, { role: "assistant", content: e instanceof ApiError ? e.message : "حدث خطأ غير متوقع." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-6rem)] max-w-4xl flex-col px-4 sm:px-6">
      {msgs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <Logo className="h-24 w-48" />
          <h1 className="mt-6 text-3xl font-bold text-night-700 sm:text-4xl">اسأل تصحيح عن أي حديث</h1>
          <p className="mt-3 max-w-xl text-lg leading-8 text-muted">
            اكتب سؤالك كما تكتبه لصديق، أو الصق الرسالة التي وصلتك. سنستخرج نص الحديث ونعرض حكمه من مصدره.
          </p>
          <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
            {STARTERS.map((s) => (
              <button key={s} onClick={() => send(s)} className="card p-4 text-start text-[15px] leading-7 text-ink/80 transition-all hover:-translate-y-0.5 hover:border-brand-500/40">
                {s}
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">تصحيح متخصص في التحقق من الأحاديث. أسئلة الفتوى والأحكام الفقهية تُحال إلى أهل العلم.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-6 py-8" aria-live="polite">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-ss-sm bg-night-700 px-5 py-3.5 leading-8 text-white shadow">{m.content}</div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-white shadow ring-1 ring-line">
                  <Logo className="h-5 w-8" />
                </span>
                <div className="min-w-0 flex-1">
                  {m.result ? (
                    <ResultCard r={m.result} />
                  ) : (
                    <div className="card whitespace-pre-line px-5 py-4 leading-8 text-ink/85">{m.content}</div>
                  )}
                </div>
              </div>
            ),
          )}
          {busy && (
            <div className="flex items-center gap-3 text-muted">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-2 animate-bounce rounded-full bg-brand-500" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </span>
              يبحث في المصادر...
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="sticky bottom-0 bg-gradient-to-t from-paper via-paper to-transparent pt-4 pb-6"
      >
        <div className="card flex items-end gap-2 p-2 focus-within:ring-4 focus-within:ring-brand-500/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            rows={1}
            maxLength={4000}
            placeholder="اكتب سؤالك عن حديث..."
            aria-label="سؤالك"
            className="field-sizing-content max-h-40 min-h-12 flex-1 resize-none bg-transparent px-4 py-3 outline-none"
          />
          <button type="submit" disabled={busy || !input.trim()} className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-40">
            إرسال
          </button>
        </div>
        {msgs.length > 0 && (
          <button type="button" onClick={() => setMsgs([])} className="mt-2 text-xs text-muted hover:text-brand-700">
            محادثة جديدة
          </button>
        )}
      </form>
    </div>
  );
}
