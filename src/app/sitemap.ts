import type { MetadataRoute } from "next";
import { ALL_POPULAR, hadithPath } from "@/lib/popular";
import { SITE } from "@/lib/site";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

const PAGES: [string, number, Freq][] = [
  ["/", 1, "daily"],
  ["/verify", 0.95, "weekly"],
  ["/ask", 0.9, "weekly"],
  ["/popular", 0.9, "weekly"],
  ["/daily", 0.8, "daily"],
  ["/prayer", 0.8, "daily"],
  ["/mustalah", 0.7, "monthly"],
  ["/books", 0.7, "monthly"],
  ["/scholars", 0.7, "monthly"],
  ["/guide", 0.7, "monthly"],
  ["/methodology", 0.6, "monthly"],
  ["/developers", 0.5, "monthly"],
  ["/about", 0.5, "monthly"],
  ["/privacy", 0.3, "yearly"],
  ["/terms", 0.3, "yearly"],
  ["/disclaimer", 0.3, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const updated = new Date(SITE.updated);
  return [
    ...PAGES.map(([path, priority, changeFrequency]) => ({
      url: `${SITE.url}${path === "/" ? "" : path}`,
      lastModified: changeFrequency === "daily" ? now : updated,
      changeFrequency,
      priority,
      images: path === "/" ? [`${SITE.url}/opengraph-image.jpg`] : undefined,
    })),
    ...ALL_POPULAR.map((p) => ({
      url: `${SITE.url}${hadithPath(p.text)}`,
      lastModified: updated,
      changeFrequency: "weekly" as Freq,
      priority: 0.8,
    })),
  ];
}
