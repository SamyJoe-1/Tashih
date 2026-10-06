import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Amiri } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { preload } from "react-dom";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-plex",
  display: "swap",
});

// Hadith text (also in the home hero search box).
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "فريق تصحيح", url: SITE.url }],
  creator: "فريق تصحيح",
  publisher: "فريق تصحيح",
  category: "education",
  keywords: [
    "تصحيح", "صحة حديث", "هل هذا الحديث صحيح", "تخريج حديث", "درجة الحديث", "الدرر السنية", "الموسوعة الحديثية",
    "حديث صحيح", "حديث ضعيف", "حديث موضوع", "أحاديث منتشرة", "التحقق من الأحاديث", "حديث اليوم", "مواقيت الصلاة", "اتجاه القبلة",
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: "الصق الحديث... واحصل على حكمه ومصدره في ثوانٍ، دون تخمين.",
  },
  twitter: { card: "summary_large_image", title: `${SITE.name} — ${SITE.tagline}`, description: "الصق الحديث... واحصل على حكمه ومصدره في ثوانٍ، دون تخمين." },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  other: { "llms-txt": `${SITE.url}/llms.txt` },
};

export const viewport: Viewport = {
  themeColor: "#04261a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const SITE_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#org`,
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
    description: SITE.description,
    ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: SITE.nameEn,
    inLanguage: "ar",
    publisher: { "@id": `${SITE.url}/#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/verify?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    inLanguage: "ar",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  // The logo is a CSS mask (LCP on the home page); let the browser fetch it with the HTML.
  const logo = `/brand/tashih-logo.webp?time=${process.env.NEXT_PUBLIC_BUILD}`;
  preload(logo, { as: "image", fetchPriority: "high", type: "image/webp", crossOrigin: "anonymous" });
  return (
    <html lang="ar" dir="rtl" className={`${plex.variable} ${amiri.variable}`} style={{ "--logo-url": `url("${logo}")` } as React.CSSProperties}>
      <head>
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <JsonLd data={SITE_LD} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
          تخطَّ إلى المحتوى
        </a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
