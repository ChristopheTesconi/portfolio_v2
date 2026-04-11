// components/sections/About/About.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  const reducedMotion = useReducedMotion();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!t || !t.about) {
    return null;
  }

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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

  // Photo : translateX sur desktop, translateY sur mobile (fallback via CSS media query non nécessaire,
  // motion gère le même axe partout — on utilise translateX comme prévu, fallback si besoin plus tard)
  const fadeFromLeft = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: VIEWPORT_CONFIG,
        transition: {
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASING,
          delay: 0,
        },
      };

  return (
    <section
      id="apropos"
      className={styles.about}
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <motion.h2 itemProp="name" {...fadeUp(0)}>
        {t.about.title}
      </motion.h2>

      <div className={styles.aboutContainer}>
        <motion.div className={styles.photoContainer} {...fadeFromLeft}>
          <Image
            src="/christophe2.jpeg"
            alt={
              currentLocale === "fr"
                ? "Christophe Tesconi - Développeur Web Fullstack Freelance"
                : "Christophe Tesconi - Freelance Fullstack Web Developer"
            }
            width={250}
            height={400}
            sizes="(max-width: 767px) 250px, (max-width: 991px) 300px, 250px"
            className={styles.photo}
            style={{ width: "100%", height: "auto" }}
            priority
            itemProp="image"
          />
        </motion.div>

        <div className={styles.cardsContainer}>
          {t.about.sections.map((section: AboutSection, index: number) => (
            <motion.div key={index} {...fadeUp(STAGGER_DELAY * index)}>
              <AboutCard
                section={section}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
