import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero, Legend } from "@/components/ui";
import { Verifier } from "./Verifier";

export const metadata: Metadata = pageMeta("/verify", "الموسوعة الحديثية — تحقّق من حديث", "ابحث عن نص الحديث لتعرف حكمه، والمحدّث الذي حكم عليه، والكتاب الذي ورد فيه.");

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const { q } = await searchParams;
  const initial = typeof q === "string" ? q : "";
  return (
    <>
      <PageHero path="/verify"
        eyebrow="الموسوعة الحديثية"
        title="تحقّق من حديث"
        lead="اكتب نص الحديث أو جزءاً منه. يُنظَّف النص ويُبحث عنه في الموسوعة الحديثية، ثم تُعرض الأحكام كما نقلها المحدّثون."
      >
        <Legend className="mt-8" />
      </PageHero>
      <Verifier key={initial} initial={initial} />
    </>
  );
}
