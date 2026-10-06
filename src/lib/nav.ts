export const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/verify", label: "الموسوعة الحديثية" },
  { href: "/ask", label: "اسأل تصحيح" },
  { href: "/popular", label: "أحاديث منتشرة" },
  { href: "/daily", label: "حديث اليوم" },
  { href: "/prayer", label: "مواقيت الصلاة" },
] as const;

export const LIBRARY = [
  { href: "/mustalah", label: "دليل مصطلح الحديث", desc: "معاني الأحكام: صحيح، حسن، ضعيف، موضوع، وغيرها." },
  { href: "/books", label: "كتب السنة", desc: "تعريف بدواوين السنة المعتمدة ومؤلفيها." },
  { href: "/scholars", label: "أعلام المحدثين", desc: "تراجم موجزة لأئمة الحديث الذين تُنقل أحكامهم." },
  { href: "/guide", label: "كيف تتحقّق من حديث", desc: "خطوات عملية قبل أن تنشر أي حديث." },
  { href: "/methodology", label: "منهجنا", desc: "الموثوقية والسلامة العلمية في تصحيح." },
  { href: "/developers", label: "للمطورين", desc: "واجهة برمجية موثقة لبناء تطبيقات التحقق." },
] as const;
