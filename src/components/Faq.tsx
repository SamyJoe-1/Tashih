import { JsonLd } from "./JsonLd";

const FAQ = [
  ["كيف أعرف إن كان الحديث صحيحاً؟", "الصق نص الحديث في صفحة «تحقّق من حديث». يبحث تصحيح عنه في الموسوعة الحديثية ويعرض حكمه، واسم المحدّث الذي حكم عليه، والكتاب ورقم الحديث."],
  ["هل يحكم الذكاء الاصطناعي على الحديث؟", "لا. الحكم يُنقل من المصدر الحديثي دائماً ويُصنَّف بكود ثابت. دور الذكاء الاصطناعي محصور في فهم سؤالك وتبسيط شرح النتيجة الموجودة."],
  ["ما مصادر تصحيح؟", "المصدر الأساسي موسوعة الدرر السنية الحديثية، ثم قاعدة بيانات مفتوحة للكتب الستة: البخاري ومسلم وأبي داود والترمذي والنسائي وابن ماجه."],
  ["ماذا يعني «غير موجود»؟", "يعني أن النص لم يُعثر عليه بثقة كافية، فيمتنع تصحيح عن الحكم ويحيلك إلى أهل العلم. وعدم العثور لا يعني أن الحديث صحيح ولا أنه مكذوب."],
  ["لماذا تظهر أكثر من درجة للحديث نفسه؟", "لأن أحكام المحدّثين قد تختلف، أو تختلف طرق الحديث. يعرضها تصحيح كلها، ولا يقدّم حكم محدّث واحد على أنه إجماع."],
  ["هل يمكنني نشر الحديث الضعيف؟", "لا ينبغي نسبة الحديث الضعيف أو الموضوع إلى النبي ﷺ. وإذا نشرت حديثاً فانسخه مع حكمه ومصدره."],
  ["هل استخدام تصحيح مجاني؟", "نعم، المنصة مجانية ولا تتطلب تسجيلاً، ولها واجهة برمجية مفتوحة للتطبيقات."],
];

export function Faq() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
      <div className="mx-auto max-w-4xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-bold text-night-700 hover:bg-paper/60 [&::-webkit-details-marker]:hidden">
              <h3>{q}</h3>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500/10 text-brand-700 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-6 pb-6 leading-8 text-muted">{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
