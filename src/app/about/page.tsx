import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = pageMeta("/about", "عن المشروع", "تصحيح: منصة للتحقق من صحة الأحاديث النبوية بالرجوع إلى المصادر الحديثية.");

export default function AboutPage() {
  return (
    <>
      <PageHero path="/about" eyebrow="عن المشروع" title="تصحيح" lead="منصة للتحقق من صحة الأحاديث النبوية بالرجوع إلى المصادر الحديثية، وإجابات موثقة بالمصدر." />
      <div className="pattern-light">
        <Section>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-6 text-lg leading-9 text-ink/85">
              <p>
                تنتشر كل يوم عبارات منسوبة إلى النبي ﷺ عبر الرسائل ومواقع التواصل دون ذكر كتاب أو راوٍ أو حكم. والتحقق منها يحتاج الرجوع إلى كتب التخريج وأحكام المحدّثين، وهذا بعيد عن الشخص العادي. والنماذج اللغوية العامة قد تختلق حكماً أو مصدراً بثقة عالية.
              </p>
              <p>
                <strong className="text-night-700">تصحيح</strong> يجمع بين سهولة المحادثة وموثوقية المصدر: تكتب نص الحديث، فيعيد لك الحكم، ومن حكم عليه، والمصدر. الحكم يُنقل من الموسوعة الحديثية بكود ثابت، والذكاء الاصطناعي يقتصر دوره على فهم السؤال وتبسيط الشرح.
              </p>
              <h2 className="pt-4 text-2xl font-bold text-night-700">ما يقدّمه تصحيح</h2>
              <ul className="space-y-3">
                {["التحقق من الأحاديث بالنص أو بالمحادثة", "عرض جميع أحكام المحدّثين عند اختلافهم", "حديث يومي من الصحيحين", "مواقيت الصلاة واتجاه القبلة ونوافذ التركيز وقت الصلاة", "واجهة برمجية مفتوحة لتطبيق الجوال والمطورين"].map((x) => (
                  <li key={x} className="flex gap-3"><span className="mt-1 text-brand-600">✓</span>{x}</li>
                ))}
              </ul>
            </div>
            <aside className="pattern-dark rounded-3xl bg-night-900 p-8 text-center text-white">
              <Logo tone="mint" className="mx-auto h-24 w-48" />
              <p className="mt-4 text-white/75">اعرف صحة الحديث قبل أن تنشره</p>
              <p className="mt-6 text-sm text-mint-300">فريق تصحيح | ٢٠٢٦م</p>
              <Link href="/verify" className="mt-8 inline-block rounded-full bg-mint-400 px-6 py-3 font-bold text-night-900 hover:bg-mint-300">جرّب الآن</Link>
            </aside>
          </div>
        </Section>
      </div>
    </>
  );
}
