// components/sections/Faq/FaqCard/FaqCard.tsx
"use client";

import { useRef, useEffect } from "react";
import type { FaqItem } from "../faq.types";
import styles from "./FaqCard.module.css";

interface FaqCardProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqCard({ item, isOpen, onToggle }: FaqCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      if (isOpen) {
        el.style.maxHeight = el.scrollHeight + "px";
      } else {
        el.style.maxHeight = "0px";
      }
    }
  }, [isOpen]);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader} onClick={onToggle}>
        <button
          className={styles.toggleBtn}
          aria-expanded={isOpen}
          aria-label={item.question}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
        </button>
        <h3 className={styles.cardTitle}>{item.question}</h3>
      </header>

      <div className={styles.cardContent} ref={contentRef}>
        <div className={styles.contentInner}>
          <p className={styles.paragraph}>{item.answer}</p>
        </div>
      </div>
    </article>
  );
}
