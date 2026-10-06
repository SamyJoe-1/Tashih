import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { arNum } from "@/lib/cn";

export const metadata: Metadata = pageMeta("/scholars", "أعلام المحدثين", "تراجم موجزة لأئمة الحديث الذين تُنقل أحكامهم في نتائج تصحيح.");

const ERAS: { era: string; people: { name: string; death: number; works: string }[] }[] = [
  {
    era: "أئمة الرواية والتصنيف",
    people: [
      { name: "مالك بن أنس", death: 179, works: "إمام دار الهجرة، صاحب الموطأ." },
      { name: "أحمد بن حنبل", death: 241, works: "إمام أهل السنة، صاحب المسند." },
      { name: "محمد بن إسماعيل البخاري", death: 256, works: "صاحب الجامع الصحيح والتاريخ الكبير." },
      { name: "مسلم بن الحجاج", death: 261, works: "صاحب المسند الصحيح." },
      { name: "أبو داود السجستاني", death: 275, works: "صاحب السنن." },
      { name: "أبو عيسى الترمذي", death: 279, works: "صاحب الجامع والشمائل." },
      { name: "أحمد بن شعيب النسائي", death: 303, works: "صاحب السنن." },
      { name: "علي بن عمر الدارقطني", death: 385, works: "صاحب السنن والعلل." },
    ],
  },
  {
    era: "أئمة النقد والتخريج",
    people: [
      { name: "أبو الفرج ابن الجوزي", death: 597, works: "صاحب «الموضوعات» و«العلل المتناهية»." },
      { name: "يحيى بن شرف النووي", death: 676, works: "صاحب «رياض الصالحين» و«الأربعين» وشرح صحيح مسلم." },
      { name: "أحمد بن عبد الحليم ابن تيمية", death: 728, works: "شيخ الإسلام، له أحكام كثيرة على الأحاديث في فتاواه." },
      { name: "شمس الدين الذهبي", death: 748, works: "صاحب «ميزان الاعتدال» و«سير أعلام النبلاء» وتلخيص المستدرك." },
      { name: "ابن قيم الجوزية", death: 751, works: "صاحب «زاد المعاد» و«المنار المنيف»." },
      { name: "زين الدين العراقي", death: 806, works: "صاحب «المغني عن حمل الأسفار» في تخريج أحاديث الإحياء." },
      { name: "ابن حجر العسقلاني", death: 852, works: "أمير المؤمنين في الحديث، صاحب «فتح الباري» و«تقريب التهذيب»." },
      { name: "شمس الدين السخاوي", death: 902, works: "صاحب «المقاصد الحسنة» في الأحاديث المشتهرة على الألسنة." },
      { name: "جلال الدين السيوطي", death: 911, works: "صاحب «الجامع الصغير» و«اللآلئ المصنوعة»." },
    ],
  },
  {
    era: "المعاصرون",
    people: [
      { name: "أحمد شاكر", death: 1377, works: "محقّق مسند أحمد وسنن الترمذي." },
      { name: "محمد ناصر الدين الألباني", death: 1420, works: "صاحب «السلسلة الصحيحة» و«السلسلة الضعيفة» وصحيح وضعيف السنن." },
      { name: "عبد العزيز بن باز", death: 1420, works: "مفتي المملكة العربية السعودية، له أحكام حديثية في فتاواه ودروسه." },
      { name: "شعيب الأرناؤوط", death: 1438, works: "أشرف على تحقيق مسند أحمد وصحيح ابن حبان وسنن أبي داود." },
    ],
  },
];

export default function ScholarsPage() {
  return (
    <>
      <PageHero path="/scholars" eyebrow="المكتبة" title="أعلام المحدثين" lead="تراجم موجزة لأئمة الحديث الذين تظهر أسماؤهم بجوار الأحكام في نتائج تصحيح. الحكم المعروض هو حكم المحدّث المذكور، وليس إجماعاً." />
      <div className="pattern-light">
        {ERAS.map((e, i) => (
          <Section key={e.era} title={e.era} className={i ? "pt-0" : undefined}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {e.people.map((p) => (
                <article key={p.name} className="card flex gap-4 p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-night-700 text-lg font-bold text-mint-300">{p.name.replace(/^(أبو|ابن|شمس الدين|زين الدين|جلال الدين) /, "").charAt(0)}</span>
                  <div>
                    <h3 className="font-bold text-night-700">{p.name}</h3>
                    <p className="text-sm font-semibold text-brand-600">ت {arNum(p.death)}هـ</p>
                    <p className="mt-2 text-sm leading-7 text-muted">{p.works}</p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        ))}
      </div>
    </>
  );
}
