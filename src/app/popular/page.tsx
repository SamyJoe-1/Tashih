import { pageMeta } from "@/lib/site";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { PopularList } from "./PopularList";

export const metadata: Metadata = pageMeta("/popular", "أحاديث منتشرة", "عبارات تتداولها الرسائل ومواقع التواصل على أنها أحاديث. تحقّق من كل واحدة مباشرة من مصدرها.");

export default function PopularPage() {
  return (
    <>
      <PageHero path="/popular"
        eyebrow="الأكثر تداولاً"
        title="أحاديث منتشرة على ألسنة الناس"
        lead="عبارات تصل كل يوم عبر الرسائل ومواقع التواصل. لا نكتب أحكامها مسبقاً: اضغط «تحقّق» ليُجلب الحكم مباشرة من المصدر الحديثي."
      />
      <PopularList />
    </>
  );
}
