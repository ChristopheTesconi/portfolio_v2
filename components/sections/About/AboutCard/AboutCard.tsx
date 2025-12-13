"use client";

import { useRef, useEffect } from "react";
import styles from "./AboutCard.module.css";

interface AboutSection {
  title: string;
  content: string[];
}

interface AboutCardProps {
  section: AboutSection;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AboutCard({
  section,
  isOpen,
  onToggle,
}: AboutCardProps) {
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
    <article
      className={styles.card}
      itemScope
      itemType="https://schema.org/Article"
    >
      <header className={styles.cardHeader} onClick={onToggle}>
        <button
          className={styles.toggleBtn}
          aria-expanded={isOpen}
          aria-label={`Toggle ${section.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
        </button>
        <h3 className={styles.cardTitle} itemProp="headline">
          {section.title}
        </h3>
      </header>

      <div className={styles.cardContent} ref={contentRef}>
        <div className={styles.contentInner} itemProp="articleBody">
          {section.content.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
