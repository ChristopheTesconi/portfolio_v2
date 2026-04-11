// components/sections/Services/Services.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSLATE_Y,
  STAGGER_DELAY,
  VIEWPORT_CONFIG,
} from "@/lib/animations";
import ServiceCard from "./ServiceCard/ServiceCard";
import styles from "./Services.module.css";

interface Service {
  title: string;
  icon: string;
  description: string[];
}

export default function Services() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);
  const reducedMotion = useReducedMotion();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!t || !t.services) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation scroll-triggered — fade-in + slide-up
  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: TRANSLATE_Y },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_CONFIG,
          transition: {
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASING,
            delay,
          },
        };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.services.title,
    description:
      currentLocale === "fr"
        ? "Services de développement web fullstack pour PME suisses : automatisation, sites multilingues et applications métier"
        : "Fullstack web development services for Swiss SMEs: automation, multilingual websites and business applications",
    itemListElement: t.services.services.map(
      (service: Service, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.title,
          description: service.description.join(". "),
          provider: {
            "@type": "Person",
            name: "Christophe Tesconi",
          },
          areaServed: [
            { "@type": "Country", name: "Switzerland" },
            {
              "@type": "Place",
              name:
                currentLocale === "fr"
                  ? "Suisse romande"
                  : "French-speaking Switzerland",
            },
            { "@type": "Country", name: "France" },
          ],
        },
      }),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      <section
        id="services"
        className={styles.services}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <motion.h2 itemProp="name" {...fadeUp(0)}>
          {t.services.title}
        </motion.h2>

        <div className={styles.servicesContainer}>
          {t.services.services.map((service: Service, index: number) => (
            <motion.div key={index} {...fadeUp(STAGGER_DELAY * index)}>
              <ServiceCard
                service={service}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(STAGGER_DELAY * t.services.services.length)}>
          <button onClick={scrollToContact} className={styles.cta}>
            {t.services.cta}
          </button>
        </motion.div>
      </section>
    </>
  );
}
