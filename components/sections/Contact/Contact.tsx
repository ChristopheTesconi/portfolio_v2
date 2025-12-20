"use client";

import { useState, FormEvent } from "react";
import { usePathname } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./Contact.module.css";

export default function Contact() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);

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

    // Anti-spam honeypot
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

    // Reset status after 5 seconds
    setTimeout(() => setStatus("idle"), 5000);
  };

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33786599327";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    currentLocale === "fr"
      ? "Bonjour, je souhaite discuter d'un projet web."
      : "Hello, I would like to discuss a web project."
  )}`;

  // ✅ SCHEMA.ORG CONTACTPAGE OPTIMISÉ
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
      email: "chris.tesconi@gmail.com",
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
        email: "chris.tesconi@gmail.com",
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
        <div className={styles.header}>
          <h2 itemProp="name">{t.contact.title}</h2>
          <p className={styles.subtitle} itemProp="description">
            {t.contact.subtitle}
          </p>
        </div>

        <div className={styles.contactContainer}>
          {/* Formulaire */}
          <div className={styles.formContainer}>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              itemProp="potentialAction"
              itemScope
              itemType="https://schema.org/CommunicateAction"
            >
              {/* Honeypot anti-spam (hidden) */}
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
          </div>

          {/* Alternatives */}
          <div className={styles.alternativesContainer}>
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
              href="mailto:chris.tesconi@gmail.com"
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
          </div>
        </div>

        {/* Trust badges */}
        <div className={styles.trustBadges}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon2}></span>
            <span>{t.contact.trust.response}</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon2}></span>
            <span>{t.contact.trust.quote}</span>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🇨🇭</span>
            <span>{t.contact.trust.location}</span>
          </div>
        </div>
      </section>
    </>
  );
}
