/** Commonly forwarded sayings. Rulings are never stored here; they are fetched from the source. */
export const POPULAR: { topic: string; items: string[] }[] = [
  {
    topic: "العلم",
    items: ["اطلبوا العلم ولو في الصين", "طلب العلم فريضة على كل مسلم", "اطلبوا العلم من المهد إلى اللحد", "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"],
  },
  {
    topic: "الأخلاق والمعاملة",
    items: ["الدين المعاملة", "النظافة من الإيمان", "إنما بعثت لأتمم مكارم الأخلاق", "تبسمك في وجه أخيك لك صدقة", "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه"],
  },
  {
    topic: "الأسرة والمجتمع",
    items: ["الجنة تحت أقدام الأمهات", "خيركم خيركم لأهله", "اختلاف أمتي رحمة", "حب الوطن من الإيمان"],
  },
  {
    topic: "العبادات والأذكار",
    items: ["الدين النصيحة", "من قال سبحان الله وبحمده في يوم مائة مرة حطت خطاياه", "صوموا تصحوا", "الصلاة عماد الدين", "إنما الأعمال بالنيات"],
  },
  {
    topic: "الدنيا والآخرة",
    items: ["اعمل لدنياك كأنك تعيش أبدا واعمل لآخرتك كأنك تموت غدا", "الكلمة الطيبة صدقة", "كن في الدنيا كأنك غريب أو عابر سبيل", "نحن قوم لا نأكل حتى نجوع وإذا أكلنا لا نشبع"],
  },
];

export const ALL_POPULAR = POPULAR.flatMap((g) => g.items.map((text) => ({ text, topic: g.topic })));

export const toSlug = (text: string) => text.trim().replace(/\s+/g, "-");
export const fromSlug = (slug: string) => decodeURIComponent(slug).replace(/-/g, " ");
export const hadithPath = (text: string) => `/hadith/${encodeURIComponent(toSlug(text))}`;
