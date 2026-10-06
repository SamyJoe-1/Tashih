import type { Metadata } from "next";

export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tashihweb.diagnify-ai.com").replace(/\/$/, ""),
  apiUrl: "https://tashih.diagnify-ai.com",
  name: "تصحيح",
  nameEn: "Tashih",
  tagline: "اعرف صحة الحديث قبل أن تنشره",
  description:
    "تصحيح منصة عربية للتحقق من صحة الأحاديث النبوية: الصق نص الحديث واحصل على حكمه، والمحدّث الذي حكم عليه، والمصدر، في ثوانٍ ودون تخمين. الحكم يُنقل من الموسوعة الحديثية لا من الذكاء الاصطناعي.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  updated: "2026-10-06",
};

/** Per-page metadata with canonical URL and social cards. */
export function pageMeta(path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path || "/" },
    openGraph: { type: "website", url, title: `${title} | ${SITE.name}`, description, siteName: SITE.name, locale: "ar_AR" },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.name}`, description },
    ...extra,
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "الرئيسية", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
