import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akhil-oliyil.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ak-admin", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
