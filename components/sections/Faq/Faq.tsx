// components/sections/Faq/Faq.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSLATE_Y,
  STAGGER_DELAY,
  VIEWPORT_CONFIG,
} from "@/lib/animations";
import FaqCard from "./FaqCard/FaqCard";
import type { FaqItem } from "./faq.types";
import styles from "./Faq.module.css";

export default function Faq() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);
  const reducedMotion = useReducedMotion();
  const isMounted = useIsMounted();
  const shouldAnimate = isMounted && !reducedMotion;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!t || !t.faq) {
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

  const fadeUp = (delay: number) =>
    shouldAnimate
      ? {
          initial: { opacity: 0, y: TRANSLATE_Y },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT_CONFIG,
          transition: {
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASING,
            delay,
          },
        }
      : {};

  return (
    <section id="faq" className={styles.faq}>
      <motion.h2 key={shouldAnimate ? "h2-a" : "h2-s"} {...fadeUp(0)}>
        {t.faq.title}
      </motion.h2>

      <div className={styles.faqContainer}>
        {t.faq.items.map((item: FaqItem, index: number) => (
          <motion.div
            key={shouldAnimate ? `faq-a-${index}` : `faq-s-${index}`}
            {...fadeUp(STAGGER_DELAY * index)}
          >
            <FaqCard
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        key={shouldAnimate ? "cta-a" : "cta-s"}
        {...fadeUp(STAGGER_DELAY * t.faq.items.length)}
      >
        <button onClick={scrollToContact} className={styles.cta}>
          {t.faq.cta}
        </button>
      </motion.div>
    </section>
  );
}
