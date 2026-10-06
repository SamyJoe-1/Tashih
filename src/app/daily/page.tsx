import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section } from "@/components/ui";
import { DailyCard, getDaily } from "@/components/DailyCard";

export const metadata: Metadata = pageMeta("/daily", "حديث اليوم", "حديث كل يوم من صحيحي البخاري ومسلم بنصه وإسناده ورقمه.");

export default async function DailyPage() {
  const d = await getDaily();
  return (
    <>
      <PageHero path="/daily" eyebrow="رفيقك اليومي" title="حديث اليوم" lead="حديث من الصحيحين يتجدّد كل يوم. لا يُولَّد شيء: النص والرقم يُقرآن من مصدرهما مباشرة." />
      <Section>
        <div className="max-w-4xl">
          {d ? <DailyCard d={d} /> : <div className="card p-10 text-muted">حديث اليوم غير متاح الآن، حاول لاحقاً.</div>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/verify" className="rounded-full bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">تحقّق من حديث آخر</Link>
            <Link href="/prayer" className="rounded-full border border-line bg-white px-6 py-3 font-bold text-night-700 hover:border-brand-500">مواقيت الصلاة</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
