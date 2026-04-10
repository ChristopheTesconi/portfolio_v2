import type { Metadata } from "next";
import "bootswatch/dist/lux/bootstrap.min.css";

import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://christophetesconidev.com";

  const titles = {
    fr: "Christophe Tesconi - Développeur Web Fullstack Freelance Suisse",
    en: "Christophe Tesconi - Freelance Fullstack Web Developer Switzerland",
  };

  const descriptions = {
    fr: "Développeur Web Fullstack freelance spécialisé React, Next.js et Symfony. Création de sites web et applications sur-mesure pour PME suisses. Basé en Suisse romande.",
    en: "Freelance Fullstack Web Developer specialized in React, Next.js and Symfony. Custom websites and applications for Swiss SMEs. Based in French-speaking Switzerland.",
  };

  return {
    title: {
      default: titles[locale as keyof typeof titles],
      template: "%s | Christophe Tesconi",
    },
    description: descriptions[locale as keyof typeof descriptions],
    keywords: [
      // Géographique (PRIORITÉ SEO LOCAL)
      "développeur web Suisse romande",
      "freelance Next.js Genève",
      "développeur React Lausanne",
      "freelance Symfony Suisse",
      "développeur web Ferney-Voltaire",

      // Services spécifiques
      "création site web PME suisse",
      "application web sur-mesure",
      "développeur fullstack freelance",
      "site internet multilingue",

      // Techniques
      "Next.js",
      "React",
      "TypeScript",
      "Symfony",
      "PHP",

      // Long-tail
      "développeur web multilingue",
      "freelance développement web Suisse",
      "création site internet entreprise suisse",
      "fullstack developer",
      "web developer Switzerland",
    ],
    authors: [{ name: "Christophe Tesconi" }],
    creator: "Christophe Tesconi",
    publisher: "Christophe Tesconi",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${baseUrl}/${locale}`,
      siteName: "Christophe Tesconi Portfolio",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt:
            locale === "fr"
              ? "Christophe Tesconi - Développeur Web Fullstack Freelance Suisse"
              : "Christophe Tesconi - Freelance Fullstack Web Developer Switzerland",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/fr`,
      },
    },
    category: "Technology",
    // ✅ AJOUT : Google Search Console verification (à remplir après inscription)
    // verification: {
    //   google: "votre-code-google-search-console"
    // }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />

      {/* ✅ SCHEMA.ORG PERSON (OPTIMISÉ AVEC DONNÉES LOCALES) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Christophe Tesconi",
            jobTitle:
              locale === "fr"
                ? "Développeur Web Fullstack Freelance"
                : "Freelance Fullstack Web Developer",
            description:
              locale === "fr"
                ? "Développeur Web Fullstack spécialisé en React, Next.js et Symfony pour PME suisses"
                : "Fullstack Web Developer specialized in React, Next.js and Symfony for Swiss SMEs",
            url: "https://christophetesconidev.com",
            email: "contact@christophetesconidev.com",
            telephone: "+33786599327",
            address: {
              "@type": "PostalAddress",
              streetAddress: "68 rue de Meyrin",
              addressLocality: "Ferney-Voltaire",
              addressRegion: "Auvergne-Rhône-Alpes",
              postalCode: "01210",
              addressCountry: "FR",
            },
            areaServed: [
              {
                "@type": "Country",
                name: "Switzerland",
              },
              {
                "@type": "Place",
                name:
                  locale === "fr"
                    ? "Suisse romande"
                    : "French-speaking Switzerland",
              },
              {
                "@type": "Place",
                name: "Genève",
              },
              {
                "@type": "Place",
                name: "Lausanne",
              },
            ],
            sameAs: [
              "https://github.com/ChristopheTesconi",
              "https://www.linkedin.com/in/christophe-tesconi/",
              "https://www.malt.fr/profile/christophetesconi",
            ],
            knowsAbout: [
              "React",
              "Next.js",
              "Symfony",
              "TypeScript",
              "JavaScript",
              "PHP",
              "Web Development",
              "Fullstack Development",
              "Frontend Development",
              "Backend Development",
            ],
          }),
        }}
      />

      {/* ✅ NOUVEAU : SCHEMA.ORG WEBSITE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Christophe Tesconi Portfolio",
            url: "https://christophetesconidev.com",
            description:
              locale === "fr"
                ? "Portfolio de Christophe Tesconi, développeur web fullstack freelance spécialisé en React, Next.js et Symfony pour PME suisses"
                : "Portfolio of Christophe Tesconi, freelance fullstack web developer specialized in React, Next.js and Symfony for Swiss SMEs",
            inLanguage: locale === "fr" ? "fr-FR" : "en-US",
            author: {
              "@type": "Person",
              name: "Christophe Tesconi",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `https://christophetesconidev.com/${locale}?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
