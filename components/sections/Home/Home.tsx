"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";
import TypingQuote from "../Animations/TypingQuote";
import styles from "./Home.module.css";

export default function Home() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const texts = getDictionary(currentLocale);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentLocale]);

  // ✅ SCHEMA.ORG SERVICE OPTIMISÉ (SUPPRESSION DU PERSON - DOUBLON AVEC LAYOUT)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      currentLocale === "fr"
        ? "Développement Web Fullstack"
        : "Fullstack Web Development",
    provider: {
      "@type": "Person",
      name: "Christophe Tesconi",
      url: "https://christophetesconidev.com",
    },
    // ✅ CORRECTION : Suisse + Suisse romande + France
    areaServed: [
      {
        "@type": "Country",
        name: "Switzerland",
      },
      {
        "@type": "Place",
        name:
          currentLocale === "fr"
            ? "Suisse romande"
            : "French-speaking Switzerland",
      },
      {
        "@type": "Country",
        name: "France",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name:
        currentLocale === "fr"
          ? "Services de Développement Web"
          : "Web Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              currentLocale === "fr"
                ? "Développement Frontend React & Next.js"
                : "React & Next.js Frontend Development",
            description:
              currentLocale === "fr"
                ? "Création d'interfaces web modernes et performantes avec React, Next.js et TypeScript"
                : "Building modern, high-performance web interfaces with React, Next.js and TypeScript",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              currentLocale === "fr"
                ? "Développement Backend Symfony & PHP"
                : "Symfony & PHP Backend Development",
            description:
              currentLocale === "fr"
                ? "Applications web robustes avec Symfony, API REST et bases de données"
                : "Robust web applications with Symfony, REST APIs and databases",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              currentLocale === "fr"
                ? "Sites web multilingues"
                : "Multilingual websites",
            description:
              currentLocale === "fr"
                ? "Sites internet professionnels en plusieurs langues pour toucher un public international"
                : "Professional multilingual websites to reach international audiences",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              currentLocale === "fr" ? "Optimisation SEO" : "SEO Optimization",
            description:
              currentLocale === "fr"
                ? "Référencement naturel, performances web et optimisation pour moteurs de recherche"
                : "Organic SEO, web performance and search engine optimization",
          },
        },
      ],
    },
  };

  return (
    <>
      {/* ✅ UN SEUL SCHEMA.ORG SERVICE (PERSON SUPPRIMÉ - DOUBLON AVEC LAYOUT) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section
        id="home"
        className={styles.freelance}
        itemScope
        itemType="https://schema.org/Person"
      >
        <div className={styles.freelanceContent}>
          <div className={styles.freelanceText}>
            <h1 className={styles.mainTitle} itemProp="name">
              {texts.titleFreelance}
            </h1>
            <TypingQuote text={texts.introQuote} />
            <p itemProp="description">{texts.introText}</p>
            <a
              href={`/${currentLocale}#contact`}
              className={styles.cta}
              itemProp="contactPoint"
              aria-label={
                currentLocale === "fr"
                  ? "Contactez-moi pour votre projet web"
                  : "Contact me for your web project"
              }
            >
              {texts.contactCTA}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
