"use client";

import { useState, useEffect } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import Image from "next/image";
import { FaGlobe, FaWhatsapp } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const t = getDictionary(currentLocale);

  const closeNav = () => setExpanded(false);

  const isHomePage =
    pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);

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
      }, 100);
    }
  }, [pathname]);

  if (!t || !t.nav) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    closeNav(); // (pour Navbar seulement, retirez cette ligne dans Footer)

    if (!isHomePage) {
      // ✅ CORRECTION : Ne pas mettre le hash dans l'URL, juste rediriger vers la home
      router.push(`/${currentLocale}`);

      // ✅ Attendre que la navigation soit terminée, puis scroller
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
      }, 500); // ✅ Augmenté à 500ms pour laisser le temps à la page de charger
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
    closeNav();

    if (!isHomePage) {
      router.push(`/${currentLocale}`);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const changeLanguage = (newLocale: Locale) => {
    closeNav();

    if (newLocale === currentLocale) return;

    const currentHash = window.location.hash || "";
    const pathWithoutLocale = pathname?.replace(`/${currentLocale}`, "") || "/";

    // ✅ CORRECTION : Supprimer le hash SI on n'est pas sur la home
    const isOnHomePage = pathWithoutLocale === "/" || pathWithoutLocale === "";
    const hashToKeep = isOnHomePage ? currentHash : ""; // Garder le hash seulement sur la home

    const newUrl = `/${newLocale}${pathWithoutLocale}${hashToKeep}`;

    router.push(newUrl);

    // ✅ SCROLL SEULEMENT SI ON EST SUR LA HOME AVEC UN HASH
    setTimeout(() => {
      if (isOnHomePage && hashToKeep) {
        const element = document.getElementById(hashToKeep.substring(1));
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
    }, 300);
  };

  // ✅ TEXTE WHATSAPP TRADUIT
  const whatsappText = encodeURIComponent(
    currentLocale === "fr"
      ? "Bonjour, je souhaite discuter d'un projet web."
      : "Hello, I would like to discuss a web project."
  );

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className={styles.navbar}
      fixed="top"
      as="nav"
      role="navigation"
      aria-label="Main navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <Container fluid>
        {/* ✅ LOGO AVEC LIEN HREF */}
        <Navbar.Brand
          as="a"
          href={`/${currentLocale}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          className={styles.navbarBrand}
          itemProp="url"
        >
          <Image
            src="/monlogo.png"
            alt="Christophe Tesconi - Développeur Web Fullstack Freelance"
            width={50}
            height={50}
            priority
            itemProp="logo"
          />
        </Navbar.Brand>

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto" as="ul">
            {/* ✅ LIENS AVEC HREF */}
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#home`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                aria-label="Go to home section"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.home}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#services`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
                aria-label="Discover my services"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.services}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#mesprojets`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("mesprojets");
                }}
                aria-label="View my projects"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.projects}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#apropos`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("apropos");
                }}
                aria-label="Learn about me"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.about}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#tarifs`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("tarifs");
                }}
                aria-label="View my prices"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.prices}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as="a"
                href={`/${currentLocale}#contact`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
                aria-label="Contact me"
                itemProp="url"
              >
                <span itemProp="name">{t.nav.contact}</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>

        <div className={styles.rightSection}>
          {/* ✅ WHATSAPP AVEC TEXTE TRADUIT */}
          <a
            href={`https://wa.me/33786599327?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
            onClick={closeNav}
            aria-label={
              currentLocale === "fr"
                ? "Contactez-moi sur WhatsApp"
                : "Contact me on WhatsApp"
            }
            title="WhatsApp: +33 7 86 59 93 27"
          >
            <FaWhatsapp size={24} />
          </a>

          <Dropdown className={styles.languageDropdown} align="end">
            <Dropdown.Toggle
              variant="link"
              id="language-dropdown"
              className={styles.globeIcon}
              aria-label="Select language"
            >
              <FaGlobe size={24} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeLanguage("fr");
                }}
                active={currentLocale === "fr"}
              >
                🇫🇷 Français
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  changeLanguage("en");
                }}
                active={currentLocale === "en"}
              >
                🇬🇧 English
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Navbar.Toggle
            aria-controls="main-navbar-nav"
            aria-label="Toggle navigation menu"
          />
        </div>
      </Container>
    </Navbar>
  );
}
