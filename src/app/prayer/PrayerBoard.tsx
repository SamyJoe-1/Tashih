"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type PrayerTimes, type Qibla } from "@/lib/api";
import { arNum, cn } from "@/lib/cn";

const CITIES = [
  { name: "مكة المكرمة", lat: 21.4225, lon: 39.8262, method: 4 },
  { name: "المدينة المنورة", lat: 24.4672, lon: 39.6111, method: 4 },
  { name: "الرياض", lat: 24.7136, lon: 46.6753, method: 4 },
  { name: "القاهرة", lat: 30.0444, lon: 31.2357, method: 5 },
  { name: "الإسكندرية", lat: 31.2001, lon: 29.9187, method: 5 },
  { name: "دبي", lat: 25.2048, lon: 55.2708, method: 4 },
  { name: "الكويت", lat: 29.3759, lon: 47.9774, method: 4 },
  { name: "الدوحة", lat: 25.2854, lon: 51.531, method: 4 },
  { name: "مسقط", lat: 23.588, lon: 58.3829, method: 4 },
  { name: "عمّان", lat: 31.9454, lon: 35.9284, method: 3 },
  { name: "القدس", lat: 31.7683, lon: 35.2137, method: 3 },
  { name: "الدار البيضاء", lat: 33.5731, lon: -7.5898, method: 3 },
  { name: "إسطنبول", lat: 41.0082, lon: 28.9784, method: 3 },
];

const METHODS = [
  { id: 4, name: "أم القرى" },
  { id: 5, name: "الهيئة المصرية العامة للمساحة" },
  { id: 3, name: "رابطة العالم الإسلامي" },
  { id: 2, name: "أمريكا الشمالية (ISNA)" },
  { id: 1, name: "جامعة العلوم الإسلامية بكراتشي" },
];

type Loc = { name: string; lat: number; lon: number; method: number };

function fmtTime(iso: string) {
  // Keep the location's wall-clock time from the ISO offset.
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return iso;
  let h = Number(m[1]);
  const suffix = h < 12 ? "ص" : "م";
  h = h % 12 || 12;
  return `${arNum(h)}:${arNum(m[2])} ${suffix}`;
}

function useCountdown(target?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!target) return null;
  const s = Math.max(0, Math.floor((new Date(target).getTime() - now) / 1000));
  const p = (n: number) => arNum(String(n).padStart(2, "0"));
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

export function PrayerBoard() {
  const [loc, setLoc] = useState<Loc>(CITIES[0]);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [qibla, setQibla] = useState<Qibla | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const countdown = useCountdown(times?.next_prayer?.time);

  useEffect(() => {
    let alive = true;
    Promise.all([api.prayerTimes(loc.lat, loc.lon, loc.method), api.qibla(loc.lat, loc.lon)])
      .then(([t, q]) => { if (alive) { setTimes(t); setQibla(q); setError(null); } })
      .catch((e) => alive && setError(e instanceof ApiError ? e.message : "تعذّر جلب المواقيت."));
    return () => { alive = false; };
  }, [loc]);

  function locate() {
    if (!navigator.geolocation) return setError("المتصفح لا يدعم تحديد الموقع.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setLoc({ name: "موقعي الحالي", lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4), method: loc.method }); setLocating(false); },
      () => { setError("لم نتمكّن من تحديد موقعك. اختر مدينة من القائمة."); setLocating(false); },
      { timeout: 10000 },
    );
  }

  return (
    <div className="pattern-light">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="card flex flex-wrap items-end gap-4 p-5">
          <label className="grid gap-1.5 text-sm font-semibold text-night-700">
            المدينة
            <select
              value={CITIES.some((c) => c.name === loc.name) ? loc.name : ""}
              onChange={(e) => { const c = CITIES.find((x) => x.name === e.target.value); if (c) setLoc(c); }}
              className="min-w-48 rounded-xl border border-line bg-white px-4 py-2.5 font-normal"
            >
              {!CITIES.some((c) => c.name === loc.name) && <option value="">{loc.name}</option>}
              {CITIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-night-700">
            طريقة الحساب
            <select value={loc.method} onChange={(e) => setLoc({ ...loc, method: Number(e.target.value) })} className="min-w-56 rounded-xl border border-line bg-white px-4 py-2.5 font-normal">
              {METHODS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>
          <button onClick={locate} disabled={locating} className="rounded-xl bg-night-700 px-5 py-2.5 font-bold text-white hover:bg-night-800 disabled:opacity-60">
            {locating ? "جارٍ التحديد..." : "استخدم موقعي"}
          </button>
        </div>

        {error && <p className="mt-6 rounded-xl bg-mawdu/10 px-5 py-3 font-medium text-red-800">{error}</p>}

        {times && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="pattern-dark relative overflow-hidden rounded-3xl bg-night-900 p-8 text-white shadow-xl">
                <div className="absolute -start-20 -top-20 size-72 rounded-full bg-mint-500/25 blur-3xl" />
                <div className="relative flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="text-mint-300">{times.hijri.weekday_ar} {arNum(times.hijri.day)} {times.hijri.month_ar} {arNum(times.hijri.year)}هـ</p>
                    <p className="mt-1 text-sm text-white/60">{loc.name}</p>
                    {times.next_prayer && (
                      <>
                        <p className="mt-6 text-white/70">الصلاة القادمة</p>
                        <p className="text-4xl font-bold">{times.next_prayer.name_ar}</p>
                      </>
                    )}
                  </div>
                  {countdown && <p className="text-5xl font-bold tracking-wider text-mint-400 tabular-nums sm:text-6xl" dir="ltr">{countdown}</p>}
                </div>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {times.prayers.map((p) => {
                  const next = times.next_prayer?.key === p.key;
                  return (
                    <li key={p.key} className={cn("card p-5 text-center transition-all", next && "border-brand-500 ring-4 ring-brand-500/15", !p.is_prayer && "opacity-75")}>
                      <p className={cn("font-semibold", next ? "text-brand-700" : "text-muted")}>{p.key === "dhuhr" && times.is_friday ? "الجمعة" : p.name_ar}</p>
                      <p className="mt-2 text-2xl font-bold text-night-700">{fmtTime(p.time)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {qibla && (
              <div className="card flex flex-col items-center p-8 text-center">
                <h2 className="text-xl font-bold text-night-700">اتجاه القبلة</h2>
                <div className="relative mt-8 size-60 rounded-full border-8 border-paper bg-gradient-to-b from-white to-paper shadow-inner ring-1 ring-line">
                  {["ش", "شرق", "ج", "غرب"].map((d, i) => (
                    <span key={d} className="absolute text-sm font-bold text-muted" style={{ top: "50%", left: "50%", transform: `translate(-50%,-50%) rotate(${i * 90}deg) translateY(-98px) rotate(${-i * 90}deg)` }}>
                      {["ش", "ق", "ج", "غ"][i]}
                    </span>
                  ))}
                  <div className="absolute inset-0 transition-transform duration-1000" style={{ transform: `rotate(${qibla.direction_deg}deg)` }}>
                    <div className="absolute start-1/2 top-5 h-[calc(50%-1.25rem)] w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-600 to-mint-400" style={{ insetInlineStart: "auto", left: "50%" }} />
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl">🕋</span>
                  </div>
                  <span className="absolute top-1/2 left-1/2 size-4 -translate-1/2 rounded-full bg-night-700 ring-4 ring-white" />
                </div>
                <p className="mt-6 text-3xl font-bold text-brand-700">{arNum(qibla.direction_deg.toFixed(1))}°</p>
                <p className="text-muted">{qibla.compass_ar} — من الشمال الجغرافي باتجاه عقارب الساعة</p>
              </div>
            )}
          </div>
        )}
        {!times && !error && <div className="mt-8 h-64 animate-pulse rounded-3xl bg-night-700/10" />}
        <p className="mt-8 text-sm text-muted">المواقيت من خدمة Aladhan. قد تختلف دقائق يسيرة عن تقويم بلدك الرسمي؛ اعتمد تقويم بلدك عند الاختلاف.</p>
      </div>
    </div>
  );
}
