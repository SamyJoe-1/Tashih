import type { ReactNode } from "react";
import { VERDICTS, type VerdictCode } from "@/lib/api";
import { cn } from "@/lib/cn";
import { breadcrumb } from "@/lib/site";
import { JsonLd } from "./JsonLd";

/** Light page header that mirrors the deck's inner slides. */
export function PageHero({ eyebrow, title, lead, children, path }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode; path?: string }) {
  return (
    <>
    {path && <JsonLd data={breadcrumb([{ name: title, path }])} />}
    <section className="pattern-light relative overflow-hidden border-b border-line bg-gradient-to-b from-white to-paper pt-32 pb-14">
      <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-mint-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {eyebrow && <p className="mb-3 text-sm font-semibold text-brand-600">{eyebrow}</p>}
        <h1 className="text-4xl font-bold text-night-700 sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-3xl text-lg leading-9 text-muted">{lead}</p>}
        {children}
      </div>
    </section>
    </>
  );
}

export function Section({ title, lead, children, className, id }: { title?: string; lead?: string; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      {title && <h2 className="text-3xl font-bold text-night-700 sm:text-4xl">{title}</h2>}
      {lead && <p className="mt-3 max-w-3xl text-lg leading-8 font-semibold text-brand-700">{lead}</p>}
      <div className={title || lead ? "mt-10" : ""}>{children}</div>
    </section>
  );
}

export function VerdictBadge({ code, label, size = "md" }: { code: VerdictCode | null; label?: string | null; size?: "sm" | "md" | "lg" }) {
  const v = VERDICTS[code ?? "unclear"] ?? VERDICTS.unclear;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold text-white shadow-sm",
        v.color,
        size === "sm" && "px-3 py-0.5 text-xs",
        size === "md" && "px-6 py-1.5 text-sm",
        size === "lg" && "px-9 py-2.5 text-lg",
      )}
    >
      {label ?? v.label}
    </span>
  );
}

export function Legend({ className }: { className?: string }) {
  const items = [
    ["bg-sahih", "صحيح / حسن"],
    ["bg-daif", "ضعيف"],
    ["bg-mawdu", "موضوع"],
    ["bg-unclear", "غير موجود ← إحالة"],
  ] as const;
  return (
    <ul className={cn("flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink/80", className)}>
      {items.map(([c, l]) => (
        <li key={l} className="flex items-center gap-2">
          <span className={cn("size-3.5 rounded-full", c)} />
          {l}
        </li>
      ))}
    </ul>
  );
}

export function NumberedCard({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="card group relative p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40">
      <span className="text-sm font-bold text-brand-600">{n}</span>
      <h3 className="mt-3 text-xl font-bold text-night-700">{title}</h3>
      <div className="mt-3 leading-8 text-muted">{children}</div>
      <span className="absolute inset-x-7 bottom-0 h-0.5 origin-right scale-x-0 rounded-full bg-mint-500 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-lg leading-9 text-ink/85 [&_h2]:mt-12 [&_h2:first-child]:mt-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-night-700 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-700 [&_li]:ms-6 [&_li]:list-disc [&_strong]:text-night-700">
      {children}
    </div>
  );
}
