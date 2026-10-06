import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchBox } from "@/components/SearchBox";
import { Legend, NumberedCard, Section, VerdictBadge } from "@/components/ui";
import { DailyCard, getDaily } from "@/components/DailyCard";
import { LIBRARY } from "@/lib/nav";
import { Faq } from "@/components/Faq";
import { ALL_POPULAR, hadithPath } from "@/lib/popular";

const EXAMPLES = ["إنما الأعمال بالنيات", "طلب العلم فريضة على كل مسلم", "اطلبوا العلم ولو في الصين", "الدين النصيحة"];

export default async function Home() {
  const daily = await getDaily();

  return (
    <>
      {/* HERO — slide 1 */}
      <section className="relative isolate flex min-h-[92dvh] items-center overflow-hidden bg-night-900 pt-24 pb-28 text-white">
        <Image src="/brand/bg-dark.webp" alt="" fill preload sizes="100vw" className="-z-20 object-cover" />
        <div className="pattern-dark absolute inset-0 -z-10" />
        <div className="absolute -start-48 top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-mint-500/25 blur-[120px]" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <Logo tone="mint" className="h-36 w-72 drop-shadow-[0_0_40px_rgba(79,224,160,0.35)] sm:h-44 sm:w-88" />
              <h1 className="mt-6 text-4xl leading-tight font-bold sm:text-6xl">
                اعرف صحة الحديث قبل أن تنشره
              </h1>
              <p className="mt-5 text-xl text-white/80">
                الصق الحديث... واحصل على حكمه ومصدره في ثوانٍ. دون تخمين.
              </p>
              <div className="mt-9 max-w-2xl">
                <SearchBox dark />
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-white/60">جرّب:</span>
                  {EXAMPLES.map((e) => (
                    <Link
                      key={e}
                      href={`/verify?q=${encodeURIComponent(e)}`}
                      className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-white/85 backdrop-blur transition-colors hover:border-mint-400/60 hover:text-mint-300"
                    >
                      {e}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* sample result, slide 6 */}
            <div className="animate-float hidden pt-28 lg:block">
              <div className="rotate-[-2deg] rounded-3xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
                <div className="rounded-t-2xl bg-night-700 px-6 py-4">
                  <p className="hadith h-9 overflow-hidden text-xl leading-9">إنما الأعمال بالنيات</p>
                </div>
                <div className="rounded-b-2xl bg-white p-6 text-ink">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-night-700">حكم الحديث</span>
                    <VerdictBadge code="sahih" />
                  </div>
                  <p className="mt-4 text-sm">المصدر: صحيح البخاري وصحيح مسلم</p>
                  <p className="mt-2 text-sm text-muted">شرح مبسّط مبني على النتيجة المسترجعة، مع المصدر للتحقق.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-mint-400/20 px-4 py-5 text-sm text-mint-300 sm:px-6">
            <a href="/downloads/tashih.apk" download className="inline-flex items-center gap-1.5 text-white/70 underline-offset-4 hover:text-mint-300 hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
              تحميل تطبيق الأندرويد
            </a>
            <span className="text-white/60">فريق تصحيح | ٢٠٢٦م</span>
          </div>
        </div>
      </section>

      {/* PROBLEM — slide 2 */}
      <div className="pattern-light">
        <Section title="المشكلة" lead="أحاديث تنتشر كل يوم... ولا أحد يعرف: صحيحة أم لا؟">
          <div className="grid gap-6 md:grid-cols-3">
            <NumberedCard n="01" title="تنتشر بلا مصدر">تصل عبر واتساب ومواقع التواصل دون ذكر الكتاب أو الراوي أو الحكم.</NumberedCard>
            <NumberedCard n="02" title="التحقق صعب على العامة">يحتاج الرجوع إلى كتب التخريج وأحكام المحدّثين، وهذا بعيد عن الشخص العادي.</NumberedCard>
            <NumberedCard n="03" title="الذكاء الاصطناعي قد يخطئ">النماذج العامة قد تختلق حكماً أو مصدراً بثقة عالية، وهذا خطر في أمر الدين.</NumberedCard>
          </div>
        </Section>
      </div>

      {/* SOLUTION — slide 3 */}
      <section className="bg-white">
        <Section title="الحل: تصحيح" lead="الصق الحديث... يظهر حكمه ومصدره في ثوانٍ">
          <div className="grid gap-6 md:grid-cols-3">
            <NumberedCard n="🔎" title="يبحث في الدرر السنية">يعتمد على موسوعة حديثية موثقة بدل ذاكرة النموذج.</NumberedCard>
            <NumberedCard n="⚖️" title="يعرض الحكم بموضوعية">الحكم، الكتاب، والمحدّث الذي حكم عليه، مع كل الأحكام المتاحة.</NumberedCard>
            <NumberedCard n="🤲" title="يمتنع ويحيل">إذا لم يجد الحديث لا يخمّن، ويوجّهك لسؤال أهل العلم.</NumberedCard>
          </div>
        </Section>
      </section>

      {/* HOW — slide 4 */}
      <div className="pattern-light">
        <Section title="كيف يعمل؟">
          <div className="relative">
          <div className="absolute inset-x-10 top-7 hidden h-0.5 bg-gradient-to-l from-mint-500 via-brand-500 to-night-700 md:block" />
          <ol className="relative grid gap-6 md:grid-cols-4">
            {[
              ["يلصق المستخدم الحديث", "في واجهة بحث أو محادثة بسيطة."],
              ["تنظيف النص", "إزالة التشكيل وتوحيد الحروف لرفع دقة المطابقة."],
              ["البحث في الدرر السنية", "مطابقة العبارة كاملة، ثم البحث بالكلمات إن لم توجد."],
              ["عرض النتيجة", "الحكم، المصدر، المحدّث، والرواية الصحيحة إن وُجدت."],
            ].map(([t, d], i) => (
              <li key={t} className="relative">
                <span className="relative grid size-14 place-items-center rounded-2xl bg-night-700 text-xl font-bold text-mint-300 shadow-lg ring-4 ring-paper">
                  {`0${i + 1}`}
                </span>
                <h3 className="mt-5 text-lg font-bold text-night-700">{t}</h3>
                <p className="mt-2 leading-7 text-muted">{d}</p>
              </li>
            ))}
          </ol>
          </div>
          <p className="mt-10 rounded-2xl border border-brand-500/20 bg-brand-500/5 px-6 py-4 font-semibold text-brand-700">
            إذا كان الحديث ضعيفاً نعرض الرواية الصحيحة البديلة إن وُجدت.
          </p>
        </Section>
      </div>

      {/* AI ROLE — slide 5 */}
      <section className="pattern-dark relative overflow-hidden bg-night-900 text-white">
        <Section>
          <h2 className="text-3xl font-bold sm:text-4xl">دور الذكاء الاصطناعي</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-white/90">
                <span className="grid size-8 place-items-center rounded-full bg-mawdu/90 text-sm">✕</span>
                الذكاء الاصطناعي وحده
              </h3>
              <p className="mt-4 leading-8 text-white/70">يجيب من الذاكرة، وقد يخطئ أو يختلق حكماً ومصدراً غير موجود، ولا يمكن تتبع إجابته.</p>
            </div>
            <div className="rounded-2xl border border-mint-400/40 bg-mint-400/10 p-8">
              <h3 className="flex items-center gap-3 text-xl font-bold text-mint-300">
                <span className="grid size-8 place-items-center rounded-full bg-mint-500 text-sm text-night-900">✓</span>
                الذكاء الاصطناعي مع تصحيح
              </h3>
              <p className="mt-4 leading-8 text-white/80">يفهم ما كتبه المستخدم وينظّف النص ويشرح النتيجة بلغة بسيطة. أما الحكم فيأتي من المصدر فقط.</p>
            </div>
          </div>
          <p className="mt-10 rounded-2xl bg-mint-400 px-6 py-5 text-center text-xl font-bold text-night-900">
            قاعدتنا: النموذج لا يُصدر حكماً على حديث من عنده أبداً
          </p>
        </Section>
      </section>

      {/* DAILY + LEGEND */}
      <div className="pattern-light">
        <Section title="حديث اليوم" lead="من الصحيحين، يُقرأ نصّه ورقمه من مصدره مباشرة.">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {daily ? <DailyCard d={daily} compact /> : <div className="card p-8 text-muted">حديث اليوم غير متاح الآن.</div>}
            <div className="card p-8">
              <h3 className="text-lg font-bold text-night-700">ألوان الأحكام</h3>
              <p className="mt-2 text-sm leading-7 text-muted">كل نتيجة تُعرض بلون يدل على درجتها، مع اسم المحدّث وكتابه.</p>
              <Legend className="mt-6 flex-col !gap-4" />
              <Link href="/mustalah" className="mt-8 inline-block font-semibold text-brand-700 hover:underline">
                دليل مصطلح الحديث ←
              </Link>
            </div>
          </div>
        </Section>
      </div>

      {/* LIBRARY */}
      <section className="bg-white">
        <Section title="المكتبة" lead="مراجع ثابتة تساعدك على فهم الأحكام ومصادرها.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY.map((l) => (
              <Link key={l.href} href={l.href} className="card group flex flex-col p-7 transition-all hover:-translate-y-1 hover:border-brand-500/40">
                <h3 className="text-xl font-bold text-night-700 group-hover:text-brand-700">{l.label}</h3>
                <p className="mt-2 flex-1 leading-7 text-muted">{l.desc}</p>
                <span className="mt-5 text-sm font-bold text-brand-600">تصفّح ←</span>
              </Link>
            ))}
          </div>
        </Section>
      </section>

      {/* POPULAR — internal links */}
      <div className="pattern-light">
        <Section title="أحاديث يكثر السؤال عنها" lead="عبارات منتشرة، لكل منها صفحة تعرض حكمها ومصدرها.">
          <ul className="flex flex-wrap gap-3">
            {ALL_POPULAR.slice(0, 14).map((p) => (
              <li key={p.text}>
                <Link href={hadithPath(p.text)} className="hadith block rounded-full border border-line bg-white px-5 py-2 text-ink/80 transition-colors hover:border-brand-500 hover:text-brand-700">
                  {p.text}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/popular" className="mt-8 inline-block font-bold text-brand-700 hover:underline">كل الأحاديث المنتشرة ←</Link>
        </Section>
      </div>

      {/* FAQ */}
      <section className="bg-white">
        <Section title="أسئلة شائعة">
          <Faq />
        </Section>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-l from-night-700 via-night-800 to-night-900 text-white">
        <div className="pattern-dark absolute inset-0" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">وصلك حديث؟ تحقّق منه قبل أن تنشره</h2>
          <p className="max-w-2xl text-lg text-white/75">قال النبي ﷺ: «كفى بالمرء كذباً أن يحدّث بكل ما سمع» — رواه مسلم في مقدمة صحيحه.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/verify" className="rounded-full bg-mint-400 px-8 py-3.5 font-bold text-night-900 hover:bg-mint-300">ابدأ التحقق</Link>
            <Link href="/ask" className="rounded-full border border-white/25 px-8 py-3.5 font-bold hover:border-mint-300 hover:text-mint-300">اسأل تصحيح</Link>
          </div>
        </div>
      </section>
    </>
  );
}
