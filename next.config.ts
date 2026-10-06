import type { NextConfig } from "next";

const API = process.env.TASHIH_API_URL ?? "http://127.0.0.1:8010";

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BUILD: String(Date.now()) },
  compress: true,
  reactCompiler: true,
  experimental: { inlineCss: true },
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 31536000 },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${API}/v1/:path*` }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/:icon(icon-192.png|icon-512.png|icon-maskable-512.png)", headers: [{ key: "Cache-Control", value: "public, max-age=604800" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
