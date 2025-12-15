"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { type Project } from "../projectsData";
import { type Locale } from "@/lib/i18n";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProjectCard({
  project,
  isOpen,
  onToggle,
}: ProjectCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;

  const devBadge =
    currentLocale === "fr"
      ? "🚧 Projet en développement"
      : "🚧 Project in development";

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

  const isInDevelopment = !project.liveUrl || !project.github;

  return (
    <article
      className={styles.card}
      itemScope
      itemType="https://schema.org/WebApplication"
    >
      <meta itemProp="description" content={project.description.join(". ")} />

      <header className={styles.cardHeader} onClick={onToggle}>
        <button
          className={styles.toggleBtn}
          aria-expanded={isOpen}
          aria-label={`Toggle ${project.titre}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
        </button>

        {/* ✅ IMAGE MINIATURE DANS LE HEADER */}
        <div className={styles.headerImageWrapper}>
          <Image
            src={project.image}
            alt={`${project.titre} logo`}
            width={40}
            height={40}
            className={styles.headerImage}
          />
        </div>

        <h3 className={styles.cardTitle} itemProp="name">
          {project.titre}
        </h3>
      </header>

      <div className={styles.cardContent} ref={contentRef}>
        <div className={styles.contentInner}>
          <div className={styles.imageContainer}>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visiter ${project.titre}`}
                className={styles.imageLink}
              >
                <Image
                  src={project.image}
                  alt={`${project.titre} - Capture d'écran du projet web développé par Christophe Tesconi`}
                  width={400}
                  height={300}
                  className={styles.projectImage}
                  itemProp="image"
                />
              </a>
            ) : (
              <Image
                src={project.image}
                alt={`${project.titre} - Capture d'écran du projet web développé par Christophe Tesconi`}
                width={400}
                height={300}
                className={styles.projectImage}
                itemProp="image"
              />
            )}
          </div>

          <div className={styles.textContainer}>
            <ul className={styles.description}>
              {project.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            {project.keywords && (
              <meta itemProp="keywords" content={project.keywords.join(", ")} />
            )}

            <div className={styles.links}>
              {isInDevelopment ? (
                <div className={styles.devBadge}>{devBadge}</div>
              ) : (
                <>
                  {project.liveUrl && project.liveCTA && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cta}
                      itemProp="url"
                    >
                      {project.liveCTA}
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.githubLink}
                      itemProp="codeRepository"
                    >
                      {project.githubCTA}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
