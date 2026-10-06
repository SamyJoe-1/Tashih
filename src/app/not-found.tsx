import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="pattern-light grid min-h-[80dvh] place-items-center px-4 pt-24 text-center">
      <div>
        <Logo className="mx-auto h-24 w-48" />
        <h1 className="mt-6 text-3xl font-bold text-night-700">الصفحة غير موجودة</h1>
        <p className="mt-3 text-muted">كما نمتنع عن الحكم على ما لا نجده... لم نجد هذه الصفحة.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-brand-600 px-7 py-3 font-bold text-white hover:bg-brand-700">العودة إلى الرئيسية</Link>
      </div>
    </div>
  );
}
