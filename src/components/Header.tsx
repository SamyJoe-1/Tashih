"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { NAV, LIBRARY } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dark = path === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(path);
  if (lastPath !== path) {
    setLastPath(path);
    setOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        dark ? "bg-transparent" : "border-b border-line/70 bg-white/85 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="تصحيح — الصفحة الرئيسية">
          <Logo tone={dark ? "mint" : "brand"} className="h-12 w-24" />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                dark
                  ? isActive(n.href) ? "bg-white/10 text-mint-300" : "text-white/80 hover:text-white"
                  : isActive(n.href) ? "bg-brand-500/10 text-brand-700" : "text-ink/70 hover:text-brand-700",
              )}
            >
              {n.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              className={cn(
                "flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium",
                dark ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-brand-700",
              )}
            >
              المكتبة
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="invisible absolute start-0 top-full w-80 translate-y-2 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="card p-2">
                {LIBRARY.map((l) => (
                  <Link key={l.href} href={l.href} className="block rounded-xl px-4 py-3 hover:bg-paper">
                    <div className="font-semibold text-ink">{l.label}</div>
                    <div className="text-sm text-muted">{l.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <Link
          href="/verify"
          className={cn(
            "ms-auto hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all sm:flex lg:ms-0",
            dark ? "bg-mint-400 text-night-900 hover:bg-mint-300" : "bg-brand-600 text-white hover:bg-brand-700",
          )}
        >
          <SearchIcon /> تحقّق من حديث
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className={cn("ms-auto rounded-xl p-2 sm:ms-0 lg:hidden", dark ? "text-white" : "text-ink")}
          aria-label="القائمة"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white px-4 pb-6 lg:hidden">
          <nav className="grid gap-1 py-3">
            {[...NAV, ...LIBRARY].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn("rounded-xl px-4 py-3 font-medium", isActive(n.href) ? "bg-brand-500/10 text-brand-700" : "text-ink")}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
