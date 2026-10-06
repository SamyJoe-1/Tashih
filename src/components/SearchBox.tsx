"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "./Header";
import { cn } from "@/lib/cn";

export function SearchBox({ initial = "", dark = false, autoFocus = false, onSearch }: { initial?: string; dark?: boolean; autoFocus?: boolean; onSearch?: (q: string) => void }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    if (onSearch) onSearch(t);
    else router.push(`/verify?q=${encodeURIComponent(t)}`);
  }

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div
        className={cn(
          "flex items-stretch gap-2 rounded-2xl p-2 transition-shadow",
          dark ? "bg-white/95 shadow-2xl shadow-black/30 ring-1 ring-mint-400/30 focus-within:ring-4 focus-within:ring-mint-400/40" : "card focus-within:ring-4 focus-within:ring-brand-500/20",
        )}
      >
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) submit(e);
          }}
          rows={1}
          maxLength={2000}
          autoFocus={autoFocus}
          placeholder="الصق نص الحديث هنا... مثال: إنما الأعمال بالنيات"
          aria-label="نص الحديث"
          className="hadith min-h-14 flex-1 resize-none bg-transparent px-4 py-3 text-lg leading-8 text-ink outline-none placeholder:font-sans placeholder:text-base placeholder:text-muted/70 field-sizing-content max-h-48"
        />
        <button
          type="submit"
          aria-label="تحقّق من الحديث"
          className="flex shrink-0 items-center gap-2 self-end rounded-xl bg-brand-600 px-6 py-3.5 font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          disabled={!q.trim()}
        >
          <SearchIcon size={18} />
          <span className="hidden sm:inline">تحقّق</span>
        </button>
      </div>
    </form>
  );
}
