"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function Footer() {
  const year = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);

  const isHomePage =
    pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  const scrollToSection = (sectionId: string) => {
    // PAS de closeNav() dans Footer !

    if (!isHomePage) {
      router.push(`/${currentLocale}`);

      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 90;
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 90;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToTop = () => {
    if (!isHomePage) {
      router.push(`/${currentLocale}`);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!t || !t.footer) {
    return null;
  }

  return (
    <footer
      className={styles.footer}
      role="contentinfo"
      aria-label="Site footer"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className={styles.footerContainer}>
        {/* Section About/Tagline */}
        <div className={styles.footerSection}>
          <h2 className={styles.footerBrand} itemProp="name">
            {t.footer.brand}
          </h2>
          <p className={styles.footerTagline}>{t.footer.tagline}</p>
          <address className={styles.footerAddress}>
            <p
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="addressLocality">{t.footer.address}</span>
            </p>
            <p>
              <a
                href={`https://wa.me/33786599327?text=${encodeURIComponent(
                  currentLocale === "fr"
                    ? "Bonjour, je souhaite discuter d'un projet web."
                    : "Hello, I would like to discuss a web project."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                itemProp="telephone"
                aria-label={`Contact via WhatsApp: ${t.footer.phone}`}
              >
                {t.footer.phone}
              </a>
            </p>
            <p>
              <a
                href="mailto:chris.tesconi@gmail.com"
                itemProp="email"
                aria-label={`Send email to ${t.footer.email}`}
              >
                {t.footer.email}
              </a>
            </p>
          </address>
        </div>

        {/* Section Quick Links */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerHeading}>{t.footer.quickLinks}</h3>
          <nav aria-label="Footer navigation">
            <ul className={styles.footerLinks}>
              {/* ✅ LIENS AVEC HREF */}
              <li>
                <a
                  href={`/${currentLocale}#home`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTop();
                  }}
                  className={styles.footerLink}
                  aria-label="Go to home page"
                >
                  {t.footer.home}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}#services`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("services");
                  }}
                  className={styles.footerLink}
                  aria-label="View services"
                >
                  {t.footer.services}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}#mesprojets`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("mesprojets");
                  }}
                  className={styles.footerLink}
                  aria-label="View projects"
                >
                  {t.footer.projects}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}#apropos`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("apropos");
                  }}
                  className={styles.footerLink}
                  aria-label="Learn about me"
                >
                  {t.footer.about}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}#tarifs`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("tarifs");
                  }}
                  className={styles.footerLink}
                  aria-label="View pricing"
                >
                  {t.footer.pricing}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}#contact`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  className={styles.footerLink}
                  aria-label="Contact me"
                >
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <a
                  href={`/${currentLocale}/${
                    currentLocale === "fr" ? "mentions-legales" : "legal-notice"
                  }`}
                  className={styles.footerLink}
                  aria-label={
                    currentLocale === "fr"
                      ? "Consulter les mentions légales"
                      : "Read legal notice"
                  }
                >
                  {t.footer.legal}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Section Social Media */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerHeading}>{t.footer.followUs}</h3>
          <div
            className={styles.socialLinks}
            role="group"
            aria-label="Social media links"
          >
            <a
              href={`https://wa.me/33786599327?text=${encodeURIComponent(
                currentLocale === "fr"
                  ? "Bonjour, je souhaite discuter d'un projet web."
                  : "Hello, I would like to discuss a web project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact on WhatsApp"
              title="WhatsApp"
              className={styles.socialLink}
            >
              <i className="bi bi-whatsapp" aria-hidden="true"></i>
              <span>{t.footer.whatsapp}</span>
            </a>

            <a
              href="https://calendly.com/chris-tesconi/web-project-consultation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a consultation on Calendly"
              title="Calendly"
              className={styles.socialLink}
            >
              <Image
                src="/C6.png"
                alt="Calendly"
                width={20}
                height={20}
                aria-hidden="true"
              />
              <span>{t.footer.calendly}</span>
            </a>

            <a
              href="https://www.malt.fr/profile/christophetesconi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Malt profile"
              title="Malt"
              className={styles.socialLink}
            >
              <Image
                src="/logo_malt.png"
                alt="Malt"
                width={20}
                height={20}
                aria-hidden="true"
              />
              <span>{t.footer.malt}</span>
            </a>

            <a
              href="https://www.linkedin.com/in/christophe-tesconi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on LinkedIn"
              title="LinkedIn"
              className={styles.socialLink}
            >
              <i className="bi bi-linkedin" aria-hidden="true"></i>
              <span>{t.footer.linkedin}</span>
            </a>

            <a
              href="https://github.com/ChristopheTesconi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View GitHub repositories"
              title="GitHub"
              className={styles.socialLink}
            >
              <i className="bi bi-github" aria-hidden="true"></i>
              <span>{t.footer.github}</span>
            </a>
          </div>
        </div>

        {/* Logo Section */}
        <div className={styles.footerLogoSection}>
          {/* ✅ LOGO AVEC <a> */}
          <a
            href={`/${currentLocale}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            className={styles.logoWrapper}
            aria-label="Back to top"
          >
            <Image
              src="/monlogo.png"
              alt="Christophe Tesconi - Développeur Web Fullstack"
              width={110}
              height={110}
              priority
              className={styles.footerLogo}
            />
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {year} {t.footer.brand}. {t.footer.copyright}
          <br />
          <span className={styles.madeWith}>
            {t.footer.madeWith}{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.nextjsLink}
            >
              {t.footer.nextjs}
            </a>
          </span>
        </p>
      </div>

      {/* ✅ SCHEMA.ORG SUPPRIMÉ (DOUBLON AVEC LAYOUT.TSX) */}
    </footer>
  );
}
