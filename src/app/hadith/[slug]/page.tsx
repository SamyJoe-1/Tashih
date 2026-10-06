import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, VERDICTS, type VerifyResult } from "@/lib/api";
import { ALL_POPULAR, fromSlug, hadithPath, toSlug } from "@/lib/popular";
import { breadcrumb, pageMeta, SITE } from "@/lib/site";
import { ResultCard } from "@/components/ResultCard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_POPULAR.map((p) => ({ slug: toSlug(p.text) }));
}

async function load(slug: string): Promise<{ text: string; topic: string; r: VerifyResult | null }> {
  const text = fromSlug(slug);
  const item = ALL_POPULAR.find((p) => p.text === text);
  if (!item) notFound();
  try {
    return { ...item, r: await api.verify(item.text) };
  } catch {
    return { ...item, r: null };
  }
}

function summary(text: string, r: VerifyResult | null) {
  if (r?.status === "found" && r.best_match) {
    const m = r.best_match;
    return `حديث «${text}»: ${r.verdict_ar}${m.muhaddith ? `، حكم عليه ${m.muhaddith}` : ""}${m.source_book ? ` في ${m.source_book}` : ""}. اطّلع على أحكام المحدّثين ومصادرها.`;
  }
  return `هل حديث «${text}» صحيح؟ نتيجة البحث عنه في الموسوعة الحديثية، مع الإحالة إلى أهل العلم عند عدم العثور عليه.`;
}

export async function generateMetadata({ params }: PageProps<"/hadith/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { text, r } = await load(slug);
  return pageMeta(hadithPath(text), `صحة حديث «${text}»`, summary(text, r));
}

export default async function HadithPage({ params }: PageProps<"/hadith/[slug]">) {
  const { slug } = await params;
  const { text, topic, r } = await load(slug);
  const path = hadithPath(text);
  const related = ALL_POPULAR.filter((p) => p.topic === topic && p.text !== text);

  const ld: object[] = [breadcrumb([{ name: "أحاديث منتشرة", path: "/popular" }, { name: text, path }])];
  if (r?.status === "found" && r.best_match && r.verdict_code) {
    const v = VERDICTS[r.verdict_code] ?? VERDICTS.unclear;
    const rating = { sahih: 5, hasan: 4, unclear: 3, daif: 2, mawdu: 1 }[r.verdict_code] ?? 3;
    ld.push({
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      url: `${SITE.url}${path}`,
      claimReviewed: `قول النبي ﷺ: «${text}»`,
      datePublished: SITE.updated,
      inLanguage: "ar",
      author: { "@type": "Organization", name: SITE.name, url: SITE.url },
      reviewRating: { "@type": "Rating", ratingValue: rating, bestRating: 5, worstRating: 1, alternateName: r.verdict_ar ?? v.label },
      itemReviewed: {
        "@type": "Claim",
        author: r.best_match.muhaddith ? { "@type": "Person", name: r.best_match.muhaddith } : undefined,
        appearance: r.best_match.source_book ? { "@type": "CreativeWork", name: r.best_match.source_book } : undefined,
      },
    });
  }

  return (
    <>
      <JsonLd data={ld} />
      <PageHero eyebrow={`أحاديث منتشرة · ${topic}`} title={`صحة حديث «${text}»`} lead={summary(text, r)}>
        <nav aria-label="مسار التنقل" className="mt-6 text-sm text-muted">
          <Link href="/" className="hover:text-brand-700">الرئيسية</Link> /{" "}
          <Link href="/popular" className="hover:text-brand-700">أحاديث منتشرة</Link> / <span className="text-ink">{text}</span>
        </nav>
      </PageHero>
      <div className="pattern-light">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0">
            {r ? <ResultCard r={r} /> : <div className="card p-8 text-muted">تعذّر جلب الحكم الآن. <Link className="font-bold text-brand-700" href={`/verify?q=${encodeURIComponent(text)}`}>أعد المحاولة</Link></div>}
          </div>
          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-night-700">أحاديث ذات صلة</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {related.map((p) => (
                  <li key={p.text}><Link href={hadithPath(p.text)} className="hadith text-base text-ink/80 hover:text-brand-700">«{p.text}»</Link></li>
                ))}
              </ul>
            </div>
            <Link href="/verify" className="block rounded-2xl bg-night-700 p-6 text-white hover:bg-night-800">
              <span className="font-bold text-mint-300">تحقّق من حديث آخر ←</span>
              <span className="mt-2 block text-sm text-white/75">الصق أي نص واحصل على حكمه ومصدره.</span>
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
