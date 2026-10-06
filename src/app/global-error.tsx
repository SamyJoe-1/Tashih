"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#04261a", color: "#fff", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0, textAlign: "center" }}>
        <div>
          <h1>حدث خطأ غير متوقع</h1>
          <button onClick={reset} style={{ marginTop: 16, padding: "12px 28px", borderRadius: 999, border: 0, background: "#4fe0a0", color: "#04261a", fontWeight: 700, cursor: "pointer" }}>
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
