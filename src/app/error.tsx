"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="pattern-light grid min-h-[70dvh] place-items-center px-4 pt-24 text-center">
      <div>
        <h1 className="text-3xl font-bold text-night-700">حدث خطأ غير متوقع</h1>
        <p className="mt-3 text-muted">نعتذر عن ذلك. حاول مرة أخرى، أو عُد إلى الصفحة الرئيسية.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="rounded-full bg-brand-600 px-7 py-3 font-bold text-white hover:bg-brand-700">إعادة المحاولة</button>
          <Link href="/" className="rounded-full border border-line bg-white px-7 py-3 font-bold text-night-700">الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
