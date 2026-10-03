import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhil-oliyil.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${siteUrl}/work/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
