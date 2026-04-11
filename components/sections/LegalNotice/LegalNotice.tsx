// components/sections/LegalNotice/LegalNotice.tsx
"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSLATE_Y,
  STAGGER_DELAY,
  VIEWPORT_CONFIG,
} from "@/lib/animations";
import styles from "./LegalNotice.module.css";

type Locale = "en" | "fr";

interface ContentTranslation {
  title: string;
  owner: string;
  companyName: string;
  ownerName: string;
  status: string;
  statusValue: string;
  siret: string;
  siretValue: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  website: string;
  hosting: string;
  hostingName: string;
  hostingAddress: string;
  liability: string;
  liabilityText: string;
  links: string;
  linksText: string;
  copyright: string;
  copyrightText: string;
  privacy: string;
  privacyText: string;
  footerCopyright: string;
}

export default function LegalNotice() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "fr") as Locale;
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();
  const isMounted = useIsMounted();
  const shouldAnimate = isMounted && !reducedMotion;

  const content: Record<string, ContentTranslation> = {
    fr: {
      title: "Mentions Légales",
      owner: "Éditeur du site",
      companyName: "Christophe Tesconi - Développeur Web Fullstack",
      ownerName: "Christophe Tesconi",
      status: "Statut juridique",
      statusValue: "Micro-entreprise",
      siret: "SIRET",
      siretValue: "991 402 256 00010",
      address: "68 rue de Meyrin\n01210 Ferney-Voltaire, France",
      contact: "Contact",
      phone: "Téléphone",
      email: "E-mail",
      website: "Site web",
      hosting: "Hébergement",
      hostingName: "o2switch",
      hostingAddress:
        "CHEMIN DES PARDIAUX\n63000 Clermont-Ferrand, France\nTél : 04 44 44 60 40",
      liability: "Responsabilité du contenu",
      liabilityText:
        "Le contenu de ce site web a été créé avec le plus grand soin. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité ou l'actualité du contenu. En tant qu'éditeur, nous sommes responsables de notre propre contenu sur ces pages selon la loi française générale.",
      links: "Responsabilité des liens",
      linksText:
        "Notre site web peut contenir des liens vers des sites web externes de tiers, sur le contenu desquels nous n'avons aucune influence. Par conséquent, nous ne pouvons assumer aucune responsabilité pour ces contenus externes. Le fournisseur ou l'exploitant respectif des pages est toujours responsable du contenu des pages liées.",
      copyright: "Droits d'auteur",
      copyrightText:
        "Tous les textes, photos, vidéos et autres contenus de ce site web sont protégés par le droit d'auteur. Toute utilisation au-delà des limites du droit d'auteur nécessite le consentement écrit préalable de l'éditeur.",
      privacy: "Protection des données",
      privacyText:
        "Nous respectons votre vie privée. Les données personnelles (telles que nom, adresse ou adresse e-mail) ne sont collectées que sur une base volontaire dans la mesure du possible. Ces données ne seront pas transmises à des tiers sans votre consentement explicite. Nous utilisons des mesures techniques et organisationnelles appropriées pour protéger vos données contre toute manipulation accidentelle ou intentionnelle, perte, destruction ou accès par des personnes non autorisées.",
      footerCopyright: " Christophe Tesconi - Tous droits réservés.",
    },
    en: {
      title: "Legal Notice",
      owner: "Website Publisher",
      companyName: "Christophe Tesconi - Fullstack Web Developer",
      ownerName: "Christophe Tesconi",
      status: "Legal Status",
      statusValue: "Sole Proprietorship (Micro-entreprise)",
      siret: "SIRET",
      siretValue: "991 402 256 00010",
      address: "68 rue de Meyrin\n01210 Ferney-Voltaire, France",
      contact: "Contact",
      phone: "Phone",
      email: "Email",
      website: "Website",
      hosting: "Web Hosting",
      hostingName: "o2switch",
      hostingAddress:
        "CHEMIN DES PARDIAUX\n63000 Clermont-Ferrand, France\nPhone: +33 4 44 44 60 40",
      liability: "Liability for Content",
      liabilityText:
        "The contents of this website were created with the greatest possible care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. As a publisher, we are responsible for our own content on these pages under general French law.",
      links: "Liability for Links",
      linksText:
        "Our website may contain links to external websites of third parties, over whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of linked pages.",
      copyright: "Copyright",
      copyrightText:
        "All texts, photos, videos, and other content on this website are protected by copyright. Any use outside the limits of copyright law requires prior written consent from the publisher.",
      privacy: "Data Protection",
      privacyText:
        "We respect your privacy. Personal data (such as name, address, or email address) is collected only on a voluntary basis whenever possible. This data will not be passed on to third parties without your explicit consent. We use appropriate technical and organizational measures to protect your data against accidental or intentional manipulation, loss, destruction, or access by unauthorized persons.",
      footerCopyright: " Christophe Tesconi - All rights reserved.",
    },
  };

  const t = content[currentLocale] || content.fr;

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

  const legalSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.title,
    description:
      currentLocale === "fr"
        ? "Mentions légales de Christophe Tesconi, développeur web fullstack freelance - SIRET, coordonnées, hébergement et informations légales"
        : "Legal notice of Christophe Tesconi, freelance fullstack web developer - SIRET, contact details, hosting and legal information",
    url: `https://christophetesconidev.com/${currentLocale}/${
      currentLocale === "fr" ? "mentions-legales" : "legal-notice"
    }`,
    inLanguage: currentLocale === "fr" ? "fr-FR" : "en-US",
    publisher: {
      "@type": "Person",
      name: "Christophe Tesconi",
      email: "contact@christophetesconidev.com",
      telephone: "+33786599327",
    },
  };

  const sections = [
    {
      content: (
        <section
          className={styles.section}
          itemScope
          itemType="https://schema.org/Organization"
        >
          <h2>{t.owner}</h2>
          <p>
            <strong itemProp="name">{t.companyName}</strong>
          </p>
          <p>
            <strong>{t.ownerName}</strong>
          </p>
          <p>
            <strong>{t.status} :</strong> {t.statusValue}
          </p>
          <p>
            <strong>{t.siret} :</strong>{" "}
            <span itemProp="taxID">{t.siretValue}</span>
          </p>
          <address
            style={{ whiteSpace: "pre-line" }}
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <span itemProp="streetAddress">68 rue de Meyrin</span>
            {"\n"}
            <span itemProp="postalCode">01210</span>{" "}
            <span itemProp="addressLocality">Ferney-Voltaire</span>,{" "}
            <span itemProp="addressCountry">France</span>
          </address>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.contact}</h2>
          <p>
            📧 {t.email}:{" "}
            <a href="mailto:" itemProp="email">
              contact@christophetesconidev.com
            </a>
          </p>
          <p>
            📞 {t.phone}:{" "}
            <a
              href="https://wa.me/33786599327"
              target="_blank"
              rel="noopener noreferrer"
              itemProp="telephone"
            >
              +33 7 86 59 93 27
            </a>
          </p>
          <p>
            🌐 {t.website}:{" "}
            <a
              href="https://christophetesconidev.com"
              target="_blank"
              rel="noopener noreferrer"
              itemProp="url"
            >
              christophetesconidev.com
            </a>
          </p>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.hosting}</h2>
          <p>
            <strong>{t.hostingName}</strong>
          </p>
          <p style={{ whiteSpace: "pre-line" }}>{t.hostingAddress}</p>
          <p>
            🌐{" "}
            <a
              href="https://www.o2switch.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.o2switch.fr
            </a>
          </p>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.liability}</h2>
          <p>{t.liabilityText}</p>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.links}</h2>
          <p>{t.linksText}</p>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.copyright}</h2>
          <p>{t.copyrightText}</p>
        </section>
      ),
    },
    {
      content: (
        <section className={styles.section}>
          <h2>{t.privacy}</h2>
          <p>{t.privacyText}</p>
        </section>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalSchema) }}
      />

      <main
        id="legal"
        className={styles.legal}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <div className={styles.container}>
          <motion.h1
            key={shouldAnimate ? "h1-a" : "h1-s"}
            className={styles.title}
            itemProp="name"
            {...fadeUp(0)}
          >
            {t.title}
          </motion.h1>

          {sections.map((section, index) => (
            <motion.div
              key={shouldAnimate ? `sec-a-${index}` : `sec-s-${index}`}
              {...fadeUp(STAGGER_DELAY * index)}
            >
              {section.content}
            </motion.div>
          ))}

          <motion.footer
            key={shouldAnimate ? "footer-a" : "footer-s"}
            className={styles.footer}
            {...fadeUp(STAGGER_DELAY * sections.length)}
          >
            <p>
              © {year} {t.footerCopyright}
            </p>
          </motion.footer>
        </div>
      </main>
    </>
  );
}
