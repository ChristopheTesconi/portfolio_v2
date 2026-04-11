// components/sections/Contact/Contact.tsx
"use client";

import { useState, FormEvent } from "react";
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
import styles from "./Contact.module.css";

export default function Contact() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);
  const reducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message:
      currentLocale === "fr"
        ? "Bonjour, je souhaite discuter d'un projet de [site vitrine / site pro / application]. Pouvez-vous me recontacter ?"
        : "Hello, I would like to discuss a project for [showcase site / pro site / application]. Can you contact me back?",
  });

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [honeypot, setHoneypot] = useState("");

  if (!t || !t.contact) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (honeypot) {
      console.log("Spam detected");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          message:
            currentLocale === "fr"
              ? "Bonjour, je souhaite discuter d'un projet de [site vitrine / site pro / application]. Pouvez-vous me recontacter ?"
              : "Hello, I would like to discuss a project for [showcase site / pro site / application]. Can you contact me back?",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33786599327";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    currentLocale === "fr"
      ? "Bonjour, je souhaite discuter d'un projet web."
      : "Hello, I would like to discuss a web project.",
  )}`;

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

  const fadeFromRight = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: VIEWPORT_CONFIG,
        transition: {
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASING,
          delay: 0.15,
        },
      };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t.contact.title,
    description: t.contact.subtitle,
    url: "https://christophetesconidev.com#contact",
    mainEntity: {
      "@type": "Person",
      name: "Christophe Tesconi",
      jobTitle:
        currentLocale === "fr"
          ? "Développeur Web Fullstack Freelance"
          : "Freelance Fullstack Web Developer",
      email: "contact@christophetesconidev.com",
      telephone: `+${whatsappNumber}`,
      url: "https://christophetesconidev.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "68 rue de Meyrin",
        addressLocality: "Ferney-Voltaire",
        postalCode: "01210",
        addressCountry: "FR",
      },
      areaServed: [
        {
          "@type": "Country",
          name: "Switzerland",
        },
        {
          "@type": "Place",
          name:
            currentLocale === "fr"
              ? "Suisse romande"
              : "French-speaking Switzerland",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${whatsappNumber}`,
        email: "contact@christophetesconidev.com",
        contactType: "Customer Service",
        availableLanguage: ["fr", "en"],
        areaServed: "CH",
        hoursAvailable: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <section
        id="contact"
        className={styles.contact}
        itemScope
        itemType="https://schema.org/ContactPage"
      >
        <motion.div className={styles.header} {...fadeUp(0)}>
          <h2 itemProp="name">{t.contact.title}</h2>
          <p className={styles.subtitle} itemProp="description">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className={styles.contactContainer}>
          <motion.div className={styles.formContainer} {...fadeFromLeft}>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              itemProp="potentialAction"
              itemScope
              itemType="https://schema.org/CommunicateAction"
            >
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className={styles.formGroup}>
                <label htmlFor="name">{t.contact.form.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t.contact.form.namePlaceholder}
                  required
                  disabled={status === "sending"}
                  autoComplete="name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">{t.contact.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t.contact.form.emailPlaceholder}
                  required
                  disabled={status === "sending"}
                  autoComplete="email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">{t.contact.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={t.contact.form.messagePlaceholder}
                  rows={6}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? t.contact.form.sending
                  : t.contact.form.submit}
              </button>

              {status === "success" && (
                <p className={styles.successMessage}>
                  {t.contact.form.success}
                </p>
              )}
              {status === "error" && (
                <p className={styles.errorMessage}>{t.contact.form.error}</p>
              )}
            </form>
          </motion.div>

          <motion.div
            className={styles.alternativesContainer}
            {...fadeFromRight}
          >
            <h3>{t.contact.alternatives.title}</h3>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.altCard}
              aria-label={t.contact.alternatives.whatsapp.cta}
              itemProp="url"
            >
              <div className={styles.altIcon}></div>
              <div className={styles.altContent}>
                <h4>
                  {t.contact.alternatives.whatsapp.title}{" "}
                  <i className="bi bi-whatsapp" aria-hidden="true"></i>
                </h4>
                <p className={styles.altSubtitle}>
                  {t.contact.alternatives.whatsapp.subtitle}
                </p>
                <span className={styles.altCta}>
                  {t.contact.alternatives.whatsapp.cta} →
                </span>
              </div>
            </a>

            <a
              href="mailto:contact@christophetesconidev.com"
              className={styles.altCard}
              aria-label={t.contact.alternatives.email.cta}
              itemProp="email"
            >
              <div className={styles.altIcon}></div>
              <div className={styles.altContent}>
                <h4>
                  {t.contact.alternatives.email.title}{" "}
                  <i className="bi bi-envelope"></i>
                </h4>
                <p className={styles.altEmail}>
                  {t.contact.alternatives.email.address}
                </p>
                <span className={styles.altCta}>
                  {t.contact.alternatives.email.cta} →
                </span>
              </div>
            </a>
          </motion.div>
        </div>

        <div className={styles.trustBadges}>
          {[
            t.contact.trust.response,
            t.contact.trust.quote,
            t.contact.trust.location,
          ].map((badge, index) => (
            <motion.div
              key={index}
              className={styles.badge}
              {...fadeUp(STAGGER_DELAY * index)}
            >
              <span
                className={index === 2 ? styles.badgeIcon : styles.badgeIcon2}
              ></span>
              <span>{badge}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
