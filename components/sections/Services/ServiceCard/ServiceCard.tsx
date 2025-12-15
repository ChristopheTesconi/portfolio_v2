"use client";

import { useRef, useEffect } from "react";
import styles from "./ServiceCard.module.css";

interface Service {
  title: string;
  icon: string;
  description: string[];
}

interface ServiceCardProps {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ServiceCard({
  service,
  isOpen,
  onToggle,
}: ServiceCardProps) {
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
      itemType="https://schema.org/Service"
    >
      {/* ✅ META CACHÉE POUR SCHEMA.ORG (Description complète en STRING) */}
      <meta itemProp="description" content={service.description.join(". ")} />

      <header className={styles.cardHeader} onClick={onToggle}>
        <button
          className={styles.toggleBtn}
          aria-expanded={isOpen}
          aria-label={`Toggle ${service.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
        </button>
        {/* <span className={styles.icon} aria-hidden="true">
          {service.icon}
        </span> */}
        <h3 className={styles.cardTitle} itemProp="name">
          {service.title}
        </h3>
      </header>

      <div className={styles.cardContent} ref={contentRef}>
        <div className={styles.contentInner}>
          {/* ✅ UL SANS itemProp (déjà dans <meta>) */}
          <ul className={styles.description}>
            {service.description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
