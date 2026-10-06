import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero, Prose } from "./ui";
import { JsonLd } from "./JsonLd";
import { breadcrumb, SITE } from "@/lib/site";

const LEGAL = [
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "شروط الاستخدام" },
  { href: "/disclaimer", label: "إخلاء المسؤولية العلمية" },
];

export function LegalPage({ path, title, lead, children }: { path: string; title: string; lead: string; children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: title, path }])} />
      <PageHero eyebrow="الصفحات القانونية" title={title} lead={lead}>
        <p className="mt-4 text-sm text-muted">آخر تحديث: ٦ أكتوبر ٢٠٢٦م</p>
      </PageHero>
      <div className="pattern-light">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_16rem]">
          <div className="card p-7 sm:p-10">
            <Prose>{children}</Prose>
          </div>
          <aside>
            <nav className="card sticky top-24 p-3" aria-label="الصفحات القانونية">
              {LEGAL.map((l) => (
                <Link key={l.href} href={l.href} className={`block rounded-xl px-4 py-3 font-medium ${l.href === path ? "bg-brand-500/10 text-brand-700" : "text-ink/75 hover:bg-paper"}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}

export function ContactLine() {
  return SITE.contactEmail ? (
    <p>
      للتواصل بشأن هذه الصفحة: <a className="font-semibold text-brand-700 underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
    </p>
  ) : (
    <p>للتواصل بشأن هذه الصفحة راسل فريق تصحيح.</p>
  );
}

export { LEGAL };
