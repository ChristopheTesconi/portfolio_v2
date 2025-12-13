import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://christophetesconidev.com";
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [];

  // Pages d'accueil FR/EN
  routes.push(
    {
      url: `${baseUrl}/fr`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    }
  );

  // Mentions légales
  routes.push(
    {
      url: `${baseUrl}/fr/mentions-legales`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/legal-notice`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    }
  );

  return routes;
}
