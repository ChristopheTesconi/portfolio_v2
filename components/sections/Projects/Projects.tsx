"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getProjectsTitle, type Locale } from "@/lib/i18n";
import ProjectCard from "./ProjectCard/ProjectCard";
import { getProjects } from "./projectsData";
import styles from "./Projects.module.css";

export default function Projects() {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const projectsTitle = getProjectsTitle(currentLocale);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const projects = getProjects(currentLocale);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
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
      // ✅ VALIDATION : URL valide ou fallback
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
          // ✅ AJOUT : Image du projet
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
          // ✅ AMÉLIORATION : potentialAction seulement si URL valide
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
        <h2 itemProp="name">{projectsTitle}</h2>

        <div className={styles.projectsContainer}>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
