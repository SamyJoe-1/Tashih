import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { NumberedCard, PageHero, Section } from "@/components/ui";

export const metadata: Metadata = pageMeta("/guide", "كيف تتحقّق من حديث", "خطوات عملية للتحقق من أي حديث قبل نشره.");

const STEPS = [
  ["توقّف قبل أن تعيد الإرسال", "الحديث نسبة كلام إلى النبي ﷺ، والتثبّت واجب قبل النشر."],
  ["انسخ متن الحديث فقط", "لا تحتاج إلى الإسناد ولا إلى عبارات المقدمة مثل «قال رسول الله ﷺ»."],
  ["ابحث في تصحيح", "الصق النص في الموسوعة الحديثية أو اسأل عنه في المحادثة."],
  ["اقرأ الحكم ومن حكم به", "انظر إلى درجة الحديث، واسم المحدّث، والكتاب ورقم الحديث."],
  ["انتبه لاختلاف الأحكام", "إذا اختلف المحدّثون، تُعرض الأحكام كلها. لا تعتبر حكماً واحداً إجماعاً."],
  ["انشر بأمانة", "انسخ الحديث مع حكمه ومصدره، ولا تنشر الضعيف أو الموضوع منسوباً إلى النبي ﷺ."],
];

export default function GuidePage() {
  return (
    <>
      <PageHero path="/guide" eyebrow="المكتبة" title="كيف تتحقّق من حديث" lead="ستّ خطوات بسيطة تحميك من نشر ما لم يقله النبي ﷺ." />
      <div className="pattern-light">
        <Section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([t, d], i) => <NumberedCard key={t} n={`0${i + 1}`} title={t}>{d}</NumberedCard>)}
          </div>
          <blockquote className="mt-12 rounded-3xl bg-night-700 p-8 text-white sm:p-10">
            <p className="hadith text-2xl text-mint-300 sm:text-3xl">«مَن حدَّث عنِّي بحديثٍ يُرى أنَّه كذِبٌ فهو أحدُ الكاذبِين»</p>
            <footer className="mt-4 text-white/70">رواه مسلم في مقدمة صحيحه</footer>
          </blockquote>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/verify" className="rounded-full bg-brand-600 px-7 py-3 font-bold text-white hover:bg-brand-700">ابدأ التحقق الآن</Link>
            <Link href="/mustalah" className="rounded-full border border-line bg-white px-7 py-3 font-bold text-night-700 hover:border-brand-500">افهم معاني الأحكام</Link>
          </div>
        </Section>
      </div>
    </>
  );
}
