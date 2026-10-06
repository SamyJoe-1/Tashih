import Link from "next/link";
import { Logo } from "./Logo";
import { NAV, LIBRARY } from "@/lib/nav";
import { LEGAL } from "./Legal";

export function Footer() {
  return (
    <footer className="pattern-dark relative mt-auto overflow-hidden bg-night-900 text-white/75">
      <div className="pointer-events-none absolute -start-40 top-0 h-96 w-96 rounded-full bg-mint-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="mint" className="h-16 w-32" />
          <p className="mt-4 max-w-sm leading-8">
            اعرف صحة الحديث قبل أن تنشره. الحكم يأتي من المصدر الحديثي دائماً، لا من النموذج اللغوي.
          </p>
          <p className="mt-6 inline-block rounded-full border border-mint-400/30 px-4 py-1.5 text-sm text-mint-300">
            المسار الأول: الحوار المعرفي والإجابات الموثقة
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">المنصة</h3>
          <ul className="grid gap-2.5">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-mint-300">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">المكتبة</h3>
          <ul className="grid gap-2.5">
            {LIBRARY.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-mint-300">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-bold text-white">عن تصحيح</h3>
          <ul className="grid gap-2.5">
            <li><Link href="/about" className="hover:text-mint-300">عن المشروع</Link></li>
            {LEGAL.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-mint-300">{n.label}</Link></li>
            ))}
            <li><a href="/sitemap.xml" className="hover:text-mint-300">خريطة الموقع</a></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:justify-between sm:px-6">
          <span>تصحيح | تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي | مؤسسة بادل الأهلية</span>
          <span>فريق تصحيح © ٢٠٢٦م</span>
        </div>
      </div>
    </footer>
  );
}
