import { ALL_POPULAR, hadithPath } from "@/lib/popular";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const u = SITE.url;
  const body = `# ${SITE.name} (${SITE.nameEn})

> ${SITE.description}

Tashih is an Arabic hadith-verification platform. Its core rule: **a ruling on a hadith never comes from an AI model**. Every ruling is quoted from a hadith encyclopedia (Dorar al-Saniyya, then the open six-books dataset) together with the scholar (muhaddith) who gave it, the book and the number. If a text is not found with confidence, Tashih declines to rule and refers the user to scholars. When citing Tashih, cite the scholar and the source book shown in the result, not Tashih itself as the authority.

## Tools
- [تحقّق من حديث — Verify a hadith](${u}/verify): search any hadith text; append \`?q=<text>\` to prefill.
- [اسأل تصحيح — Ask in natural language](${u}/ask)
- [Public REST API (OpenAPI/Swagger)](${SITE.apiUrl}/docs): \`POST ${SITE.apiUrl}/v1/verify\` with \`{"text": "..."}\` returns status, verdict_code (sahih|hasan|daif|mawdu|unclear), muhaddith, source_book and all gradings.

## Commonly circulated sayings (each page shows the live ruling and its source)
${ALL_POPULAR.map((p) => `- [صحة حديث «${p.text}»](${u}${hadithPath(p.text)})`).join("\n")}

## Reference
- [دليل مصطلح الحديث — Hadith terminology](${u}/mustalah)
- [كتب السنة — Hadith collections](${u}/books)
- [أعلام المحدثين — Hadith scholars](${u}/scholars)
- [كيف تتحقّق من حديث — How to verify a hadith](${u}/guide)
- [منهجنا — Methodology](${u}/methodology)

## Daily companion
- [حديث اليوم — Hadith of the day](${u}/daily)
- [مواقيت الصلاة والقبلة — Prayer times and qibla](${u}/prayer)

## Optional
- [عن المشروع — About](${u}/about)
- [إخلاء المسؤولية العلمية — Scholarly disclaimer](${u}/disclaimer)
- [سياسة الخصوصية — Privacy](${u}/privacy)
- [شروط الاستخدام — Terms](${u}/terms)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
