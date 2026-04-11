// components/sections/Projects/Projects.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { getProjectsTitle, type Locale } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSLATE_Y,
  STAGGER_DELAY,
  VIEWPORT_CONFIG,
} from "@/lib/animations";
import ProjectCard from "./ProjectCard/ProjectCard";
import { getProjects } from "./projectsData";
import styles from "./Projects.module.css";

export default function Projects() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const projectsTitle = getProjectsTitle(currentLocale);
  const reducedMotion = useReducedMotion();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const projects = getProjects(currentLocale);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: projectsTitle,
    description:
      currentLocale === "fr"
        ? "Portfolio de projets web réalisés par Christophe Tesconi, développeur fullstack freelance spécialisé en React, Next.js et Symfony"
        : "Web projects portfolio by Christophe Tesconi, freelance fullstack developer specialized in React, Next.js and Symfony",
    itemListElement: projects.map((project, index) => {
      const projectUrl =
        project.liveUrl || project.github || "https://christophetesconidev.com";

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: project.titre,
          description: project.description.join(". "),
          url: projectUrl,
          image: `https://christophetesconidev.com${project.image}`,
          applicationCategory: "WebApplication",
          operatingSystem: "Any",
          keywords: project.keywords?.join(", "),
          author: {
            "@type": "Person",
            name: "Christophe Tesconi",
            jobTitle:
              currentLocale === "fr"
                ? "Développeur Web Fullstack"
                : "Fullstack Web Developer",
          },
          programmingLanguage: ["JavaScript", "TypeScript", "PHP"],
          ...(project.liveUrl && {
            potentialAction: {
              "@type": "ViewAction",
              target: project.liveUrl,
            },
          }),
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />

      <section
        id="mesprojets"
        className={styles.projects}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <motion.h2 itemProp="name" {...fadeUp(0)}>
          {projectsTitle}
        </motion.h2>

        <div className={styles.projectsContainer}>
          {projects.map((project, index) => (
            <motion.div key={index} {...fadeUp(STAGGER_DELAY * index)}>
              <ProjectCard
                project={project}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
