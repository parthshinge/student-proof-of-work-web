import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://student-proof-of-work.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/auth`, lastModified: new Date() },
    { url: `${baseUrl}/dashboard`, lastModified: new Date() },
    { url: `${baseUrl}/profile/demo-student`, lastModified: new Date() },
  ];
}