import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = pageMeta("/developers", "للمطورين", "واجهة تصحيح البرمجية: تحقق من الأحاديث، ومواقيت الصلاة، وحديث اليوم.");

const ENDPOINTS = [
  ["POST", "/v1/verify", "التحقق من نص حديث وإرجاع الحكم والمحدّث والمصدر."],
  ["POST", "/v1/chat", "محادثة: تحديد المقصود ثم التحقق مع رد جاهز للعرض."],
  ["GET", "/v1/daily", "حديث اليوم من الصحيحين."],
  ["GET", "/v1/prayer/times", "مواقيت الصلاة والتاريخ الهجري والصلاة القادمة."],
  ["GET", "/v1/prayer/qibla", "اتجاه القبلة من أي موقع."],
  ["GET", "/v1/prayer/focus-schedule", "نوافذ التركيز وقت الصلاة لقفل التطبيقات المشتتة."],
  ["GET", "/health", "حالة الخدمة والمصادر."],
];

const SAMPLE = `curl -s https://tashih.diagnify-ai.com/v1/verify \\
  -H "Content-Type: application/json" \\
  -d '{"text": "اطلبوا العلم ولو في الصين"}'`;

const RESPONSE = `{
  "status": "found",
  "verdict_code": "daif",
  "verdict_ar": "ضعيف",
  "best_match": {
    "hadith_text": "اطلبوا العلمَ ولو في الصِّينِ",
    "muhaddith": "ابن باز",
    "source_book": "التحفة الكريمة",
    "grades": [ ... ]
  },
  "disclaimer_ar": "الحكم منقول من المصدر وليس من النموذج."
}`;

export default function DevelopersPage() {
  return (
    <>
      <PageHero path="/developers" eyebrow="المكتبة" title="للمطورين" lead="واجهة برمجية موثّقة (REST) بإصدار v1 يبني عليها تطبيق الجوال وأي منصة تريد إضافة التحقق الحديثي.">
        <a href="https://tashih.diagnify-ai.com/docs" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full bg-brand-600 px-7 py-3 font-bold text-white hover:bg-brand-700">
          التوثيق التفاعلي (Swagger) ↗
        </a>
      </PageHero>
      <div className="pattern-light">
        <Section title="نقاط الواجهة">
          <div className="card overflow-hidden">
            <table className="w-full text-start">
              <tbody className="divide-y divide-line">
                {ENDPOINTS.map(([m, p, d]) => (
                  <tr key={p}>
                    <td className="w-20 px-5 py-4"><span className={`rounded-md px-2 py-1 font-mono text-xs font-bold ${m === "GET" ? "bg-brand-500/10 text-brand-700" : "bg-daif/15 text-amber-800"}`}>{m}</span></td>
                    <td className="px-5 py-4 font-mono text-sm text-night-700" dir="ltr">{p}</td>
                    <td className="hidden px-5 py-4 text-muted sm:table-cell">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section title="مثال" className="pt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <pre dir="ltr" className="overflow-x-auto rounded-2xl bg-night-950 p-6 text-sm leading-7 text-mint-300"><code>{SAMPLE}</code></pre>
            <pre dir="ltr" className="overflow-x-auto rounded-2xl bg-night-950 p-6 text-sm leading-7 text-white/85"><code>{RESPONSE}</code></pre>
          </div>
          <p className="mt-6 leading-8 text-muted">
            اعرض دائماً حقل <code className="rounded bg-white px-1.5 ring-1 ring-line">disclaimer_ar</code> واسم المحدّث بجوار الحكم. الحالات الممكنة: <strong>found</strong>، <strong>not_found</strong>، <strong>out_of_scope</strong>، <strong>unavailable</strong>.
          </p>
        </Section>
      </div>
    </>
  );
}
