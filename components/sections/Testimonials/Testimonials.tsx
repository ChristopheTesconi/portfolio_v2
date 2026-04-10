"use client";

import { usePathname } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";
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

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.stars} aria-label={`${count}/5`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className={styles.star}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const dict = getDictionary(currentLocale);
  const t = dict.testimonials;

  return (
    <section id="temoignages" className={styles.testimonials}>
      <h2>{t.title}</h2>
      <p className={styles.subtitle}>{t.subtitle}</p>

      <div className={styles.cardsContainer}>
        {testimonials.map((item) => {
          const formattedDate = new Date(item.date).toLocaleDateString(
            item.lang === "fr" ? "fr-FR" : "en-US",
            { year: "numeric", month: "long", day: "numeric" },
          );

          return (
            <div key={item.id} className={styles.card}>
              <span className={styles.quoteIcon} aria-hidden="true">
                &ldquo;
              </span>

              <div className={styles.cardHeader}>
                <Stars count={item.rating} />
                <span className={styles.platform}>
                  {t.platformLabel} {item.platform}
                </span>
              </div>

              <p className={styles.text}>{item.text}</p>

              <div className={styles.authorRow}>
                <div>
                  <div className={styles.authorName}>{item.author}</div>
                  {item.company && (
                    <div className={styles.company}>{item.company}</div>
                  )}
                </div>
                <span className={styles.date}>{formattedDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
