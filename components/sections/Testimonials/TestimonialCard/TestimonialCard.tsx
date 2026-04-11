// components/sections/Testimonials/TestimonialCard/TestimonialCard.tsx
"use client";

import styles from "../Testimonials.module.css";

interface Testimonial {
  id: number;
  author: string;
  company: string | null;
  date: string;
  rating: number;
  platform: string;
  text: string;
  lang: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  platformLabel: string;
}

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

export default function TestimonialCard({
  testimonial,
  platformLabel,
}: TestimonialCardProps) {
  const formattedDate = new Date(testimonial.date).toLocaleDateString(
    testimonial.lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className={styles.card}>
      <span className={styles.quoteIcon} aria-hidden="true">
        &ldquo;
      </span>

      <div className={styles.cardHeader}>
        <Stars count={testimonial.rating} />
        <span className={styles.platform}>
          {platformLabel} {testimonial.platform}
        </span>
      </div>

      <p className={styles.text}>{testimonial.text}</p>

      <div className={styles.authorRow}>
        <div>
          <div className={styles.authorName}>{testimonial.author}</div>
          {testimonial.company && (
            <div className={styles.company}>{testimonial.company}</div>
          )}
        </div>
        <span className={styles.date}>{formattedDate}</span>
      </div>
    </div>
  );
}
