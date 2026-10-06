import { cn } from "@/lib/cn";

/** The calligraphic «تَصْحِيحٌ» mark from the deck, recoloured through a CSS mask. */
export function Logo({ className, tone = "brand" }: { className?: string; tone?: "brand" | "mint" | "white" }) {
  const color = { brand: "bg-brand-600", mint: "bg-mint-400", white: "bg-white" }[tone];
  return <span role="img" aria-label="تصحيح" className={cn("logo-mask inline-block", color, className)} />;
}
