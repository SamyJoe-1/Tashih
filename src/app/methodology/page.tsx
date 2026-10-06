import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { Legend, NumberedCard, PageHero, Section } from "@/components/ui";

export const metadata: Metadata = pageMeta("/methodology", "منهجنا", "الموثوقية والسلامة العلمية في منصة تصحيح.");

export default function MethodologyPage() {
  return (
    <>
      <PageHero path="/methodology" eyebrow="المكتبة" title="الموثوقية والسلامة العلمية" lead="كيف يصل تصحيح إلى النتيجة، ولماذا لا يخترع حكماً أبداً." />
      <div className="pattern-light">
        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            <NumberedCard n="01" title="مصدر معتمد">الحكم يأتي من موسوعة الدرر السنية الحديثية، ثم من الكتب الستة عند تعذّرها.</NumberedCard>
            <NumberedCard n="02" title="إسناد كامل">كل نتيجة تعرض الكتاب والمحدّث ليتحقّق المستخدم بنفسه.</NumberedCard>
            <NumberedCard n="03" title="امتناع وإحالة">إذا لم يُعثر على النص بثقة كافية، يمتنع النظام عن الحكم ويحيل إلى أهل العلم.</NumberedCard>
            <NumberedCard n="04" title="الرواية الصحيحة">إذا كان الحديث ضعيفاً تُعرض الروايات الأخرى الواردة إن وُجدت.</NumberedCard>
          </div>
        </Section>

        <Section title="كيف يُحدَّد الحكم؟" className="pt-0">
          <ol className="card divide-y divide-line">
            {[
              ["تنظيف النص", "حذف التشكيل والتطويل، وتوحيد الهمزات والألف المقصورة والتاء المربوطة، وإزالة عبارات المقدمة."],
              ["المطابقة", "تُقبل النتيجة إذا وُجد النص كاملاً داخل الحديث، أو تطابقت كلماته بنسبة عالية (٨٥٪ فأكثر) في العبارات الطويلة."],
              ["جمع الأحكام", "تُجمع كل أحكام المحدّثين الواردة على النص، ويُعتمد الحكم الذي قال به أكثرهم دون تقديم حكم واحد على أنه إجماع."],
              ["تصنيف الحكم بكود ثابت", "رمز الحكم (صحيح، حسن، ضعيف، موضوع) يُستخرج من عبارة المحدّث بقواعد برمجية ثابتة، لا بنموذج لغوي."],
              ["الشرح الاختياري", "إن فُعّل النموذج اللغوي، فدوره صياغة شرح مبسّط للنتيجة الموجودة فقط، ويُحذف شرحه إذا خالف الحكم."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5 p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500/10 font-bold text-brand-700">{i + 1}</span>
                <div>
                  <h3 className="font-bold text-night-700">{t}</h3>
                  <p className="mt-1 leading-8 text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="card mt-8 p-7">
            <h3 className="mb-4 font-bold text-night-700">دلالة الألوان</h3>
            <Legend />
          </div>
          <p className="mt-10 rounded-2xl bg-mint-400 px-6 py-5 text-center text-xl font-bold text-night-900">
            قاعدتنا: النموذج لا يُصدر حكماً على حديث من عنده أبداً
          </p>
        </Section>
      </div>
    </>
  );
}
