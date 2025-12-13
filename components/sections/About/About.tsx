"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import AboutCard from "./AboutCard/AboutCard";
import styles from "./About.module.css";

interface AboutSection {
  title: string;
  content: string[];
}

export default function About() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!t || !t.about) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // ✅ SCHEMA.ORG SUPPRIMÉ (DOUBLON AVEC LAYOUT.TSX)
  // Le schema Person principal est déjà dans layout.tsx avec toutes les infos

  return (
    <section
      id="apropos"
      className={styles.about}
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <h2 itemProp="name">{t.about.title}</h2>

      <div className={styles.aboutContainer}>
        <div className={styles.photoContainer}>
          <Image
            src="/christophe.jpeg"
            alt={
              currentLocale === "fr"
                ? "Christophe Tesconi - Développeur Web Fullstack Freelance"
                : "Christophe Tesconi - Freelance Fullstack Web Developer"
            }
            width={250}
            height={400}
            className={styles.photo}
            priority
            itemProp="image"
          />
        </div>

        <div className={styles.cardsContainer}>
          {t.about.sections.map((section: AboutSection, index: number) => (
            <AboutCard
              key={index}
              section={section}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
