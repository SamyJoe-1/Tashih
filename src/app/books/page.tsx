import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { arNum } from "@/lib/cn";

export const metadata: Metadata = pageMeta("/books", "كتب السنة", "تعريف بدواوين السنة النبوية المعتمدة ومؤلفيها.");

const SIX = [
  { name: "صحيح البخاري", full: "الجامع المسند الصحيح المختصر من أمور رسول الله ﷺ وسننه وأيامه", author: "محمد بن إسماعيل البخاري", death: 256, note: "أصحّ كتاب بعد كتاب الله عند جمهور العلماء، التزم فيه مؤلفه الصحيح." },
  { name: "صحيح مسلم", full: "المسند الصحيح", author: "مسلم بن الحجاج النيسابوري", death: 261, note: "يلي صحيح البخاري في الصحة، ويمتاز بجمع طرق الحديث في موضع واحد." },
  { name: "سنن أبي داود", full: "السنن", author: "سليمان بن الأشعث السجستاني", death: 275, note: "من أجمع كتب أحاديث الأحكام، وفيه الصحيح والحسن والضعيف مع بيان كثير منه." },
  { name: "جامع الترمذي", full: "الجامع (سنن الترمذي)", author: "محمد بن عيسى الترمذي", death: 279, note: "يمتاز ببيان درجة كثير من الأحاديث وذكر مذاهب الفقهاء." },
  { name: "سنن النسائي", full: "المجتبى (السنن الصغرى)", author: "أحمد بن شعيب النسائي", death: 303, note: "من أقلّ السنن ضعيفاً، لشدة شرط مؤلفه في الرجال." },
  { name: "سنن ابن ماجه", full: "السنن", author: "محمد بن يزيد القزويني", death: 273, note: "سادس الكتب الستة عند كثير من المتأخرين، وفيه زوائد على الخمسة." },
];

const OTHERS = [
  { name: "موطأ الإمام مالك", author: "مالك بن أنس", death: 179 },
  { name: "مسند الإمام أحمد", author: "أحمد بن حنبل", death: 241 },
  { name: "سنن الدارمي", author: "عبد الله بن عبد الرحمن الدارمي", death: 255 },
  { name: "صحيح ابن خزيمة", author: "محمد بن إسحاق بن خزيمة", death: 311 },
  { name: "صحيح ابن حبان", author: "محمد بن حبان البستي", death: 354 },
  { name: "سنن الدارقطني", author: "علي بن عمر الدارقطني", death: 385 },
  { name: "المستدرك على الصحيحين", author: "الحاكم النيسابوري", death: 405 },
  { name: "السنن الكبرى", author: "أبو بكر البيهقي", death: 458 },
];

export default function BooksPage() {
  return (
    <>
      <PageHero path="/books" eyebrow="المكتبة" title="كتب السنة" lead="تعريف موجز بأشهر دواوين السنة النبوية التي ترد في نتائج التحقق، ومؤلفيها وسنوات وفاتهم." />
      <div className="pattern-light">
        <Section title="الكتب الستة" lead="أصول السنة التي يعتمد عليها تصحيح في البحث دون اتصال أيضاً.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SIX.map((b, i) => (
              <article key={b.name} className="card group relative overflow-hidden p-7">
                <span className="absolute -end-4 -top-6 text-8xl font-bold text-brand-500/5">{arNum(i + 1)}</span>
                <h3 className="text-2xl font-bold text-night-700">{b.name}</h3>
                <p className="mt-1 text-sm text-brand-600">{b.full}</p>
                <p className="mt-4 leading-8 text-muted">{b.note}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="font-semibold text-ink/80">{b.author}</span>
                  <span className="rounded-full bg-paper px-3 py-1 text-muted">ت {arNum(b.death)}هـ</span>
                </div>
              </article>
            ))}
          </div>
        </Section>
        <Section title="دواوين أخرى مشهورة" className="pt-0">
          <div className="card divide-y divide-line">
            {OTHERS.map((b) => (
              <div key={b.name} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <span className="font-bold text-night-700">{b.name}</span>
                <span className="text-muted">{b.author} — ت {arNum(b.death)}هـ</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
