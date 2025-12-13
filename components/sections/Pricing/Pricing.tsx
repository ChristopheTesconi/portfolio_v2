"use client";

import { usePathname } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";
import PricingCard from "./Pricingcard/PricingCard";
import styles from "./Pricing.module.css";

interface Package {
  name: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  features: string[];
}

export default function Pricing() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);

  if (!t || !t.pricing) {
    return null;
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ✅ SCHEMA.ORG OFFERCATALOG (CORRECT)
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: t.pricing.title,
    description:
      currentLocale === "fr"
        ? "Tarifs de développement web fullstack pour PME suisses : sites vitrine, sites professionnels multilingues et applications sur-mesure"
        : "Fullstack web development pricing for Swiss SMEs: showcase sites, professional multilingual websites and custom applications",
    itemListElement: t.pricing.packages.map((pkg: Package, index: number) => ({
      "@type": "Offer",
      position: index + 1,
      name: pkg.name,
      description: pkg.features.join(". "),
      // ✅ GESTION DES PRIX (nombre ou "Sur devis")
      ...(pkg.price !== "Sur devis" &&
        pkg.price !== "On quote" && {
          priceSpecification: {
            "@type": "PriceSpecification",
            price: pkg.price.replace(/[^\d]/g, ""),
            priceCurrency: "CHF",
            valueAddedTaxIncluded: false,
          },
        }),
      // ✅ PRIX "SUR DEVIS" = Pas de prix fixe
      ...(pkg.price === "Sur devis" || pkg.price === "On quote"
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "CHF",
              price: "0",
              description:
                currentLocale === "fr"
                  ? "Prix sur devis selon le projet"
                  : "Price on quote depending on project",
            },
          }
        : {}),
      seller: {
        "@type": "Person",
        name: "Christophe Tesconi",
        url: "https://christophetesconidev.com",
      },
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
      availability: "https://schema.org/InStock",
      url: "https://christophetesconidev.com#contact",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <section
        id="tarifs"
        className={styles.pricing}
        itemScope
        itemType="https://schema.org/OfferCatalog"
      >
        <h2 itemProp="name">{t.pricing.title}</h2>

        <div className={styles.packagesContainer}>
          {t.pricing.packages.map((pkg: Package, index: number) => (
            <PricingCard key={index} package={pkg} />
          ))}
        </div>

        <ul className={styles.notes}>
          {t.pricing.notes.map((note: string, index: number) => (
            <li key={index}>{note}</li>
          ))}
        </ul>

        <button onClick={scrollToContact} className={styles.cta}>
          {t.pricing.cta}
        </button>
      </section>
    </>
  );
}
