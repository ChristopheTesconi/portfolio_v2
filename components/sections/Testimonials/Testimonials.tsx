// components/sections/Testimonials/Testimonials.tsx
"use client";

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
import TestimonialCard from "./TestimonialCard/TestimonialCard";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    id: 1,
    author: "Thierry",
    company: null,
    date: "2025-11-10",
    rating: 5,
    platform: "Malt",
    text: "Excellente collaboration ; très réactif et s'est mis à notre niveau pour bien comprendre la philosophie de notre Lieu de Vie.",
    lang: "fr",
  },
  {
    id: 2,
    author: "Wilfried Tah",
    company: "RDF Bachata Fusion",
    date: "2025-11-04",
    rating: 5,
    platform: "Malt",
    text: "He built a new website for my dance classes in Saint-Gallen, and he did a remarkable job! He really brought my vision to life — the site is colorful, friendly, and easy to navigate. Christophe was professional, efficient, and a pleasure to work with throughout the whole process. I'd definitely recommend him and would be happy to collaborate again on future projects.",
    lang: "en",
  },
];

export default function Testimonials() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const dict = getDictionary(currentLocale);
  const t = dict.testimonials;
  const reducedMotion = useReducedMotion();

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

  return (
    <section id="temoignages" className={styles.testimonials}>
      <motion.h2 {...fadeUp(0)}>{t.title}</motion.h2>
      <motion.p className={styles.subtitle} {...fadeUp(0)}>
        {t.subtitle}
      </motion.p>

      <div className={styles.cardsContainer}>
        {testimonials.map((item, index) => (
          <motion.div key={item.id} {...fadeUp(STAGGER_DELAY * index)}>
            <TestimonialCard
              testimonial={item}
              platformLabel={t.platformLabel}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
