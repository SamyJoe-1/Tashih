"use client";

import { useState } from "react";
import { api, ApiError, type VerifyResult } from "@/lib/api";
import { ResultCard } from "@/components/ResultCard";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { POPULAR as GROUPS, hadithPath } from "@/lib/popular";


function Item({ text }: { text: string }) {
  const [state, setState] = useState<{ loading?: boolean; r?: VerifyResult; err?: string }>({});
  const open = state.r || state.err;

  async function check() {
    if (state.r) return setState({});
    setState({ loading: true });
    try {
      setState({ r: await api.verify(text) });
    } catch (e) {
      setState({ err: e instanceof ApiError ? e.message : "تعذّر التحقق الآن." });
    }
  }

  return (
    <li className={cn("card overflow-hidden transition-all", open && "border-brand-500/40")}>
      <div className="flex items-center gap-4 p-5">
        <Link href={hadithPath(text)} className="hadith flex-1 text-lg text-night-700 hover:text-brand-700">«{text}»</Link>
        <button
          onClick={check}
          disabled={state.loading}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-colors",
            open ? "bg-paper text-night-700 hover:bg-line" : "bg-brand-600 text-white hover:bg-brand-700",
          )}
        >
          {state.loading ? "جارٍ..." : open ? "إخفاء" : "تحقّق"}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper/60 p-5">
          {state.err ? <p className="text-mawdu">{state.err}</p> : state.r && <ResultCard r={state.r} />}
        </div>
      )}
    </li>
  );
}

export function PopularList() {
  const [active, setActive] = useState("الكل");
  const groups = active === "الكل" ? GROUPS : GROUPS.filter((g) => g.topic === active);
  return (
    <div className="pattern-light">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {["الكل", ...GROUPS.map((g) => g.topic)].map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={cn("rounded-full px-5 py-2 text-sm font-semibold transition-colors", active === t ? "bg-night-700 text-white" : "bg-white text-ink/70 ring-1 ring-line hover:text-brand-700")}
            >
              {t}
            </button>
          ))}
        </div>
        {groups.map((g) => (
          <section key={g.topic} className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-night-700">{g.topic}</h2>
            <ul className="grid gap-4">
              {g.items.map((t) => <Item key={t} text={t} />)}
            </ul>
          </section>
        ))}
        <p className="mt-12 rounded-2xl bg-white p-6 text-sm leading-7 text-muted ring-1 ring-line">
          وجود عبارة في هذه القائمة لا يعني أنها ضعيفة أو صحيحة؛ هي عبارات كثيرة التداول فقط. الحكم يظهر بعد التحقق، منقولاً عن المحدّثين.
        </p>
      </div>
    </div>
  );
}
