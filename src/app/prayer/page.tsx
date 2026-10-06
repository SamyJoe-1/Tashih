import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { PrayerBoard } from "./PrayerBoard";

export const metadata: Metadata = pageMeta("/prayer", "مواقيت الصلاة والقبلة", "مواقيت الصلاة لمدينتك، والتاريخ الهجري، والعدّ التنازلي للصلاة القادمة، واتجاه القبلة.");

export default function PrayerPage() {
  return (
    <>
      <PageHero path="/prayer" eyebrow="رفيقك اليومي" title="مواقيت الصلاة والقبلة" lead="حدّد موقعك أو اختر مدينتك لتعرف مواقيت الصلاة والتاريخ الهجري واتجاه القبلة." />
      <PrayerBoard />
    </>
  );
}
