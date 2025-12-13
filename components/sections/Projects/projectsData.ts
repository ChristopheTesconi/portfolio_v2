import { type Locale } from "@/lib/i18n";
import { getProjectsData } from "@/lib/i18n";

export interface Project {
  titre: string;
  description: string[];
  keywords?: string[];
  image: string;
  github: string;
  githubCTA: string;
  liveUrl?: string;
  liveCTA?: string;
  devBadge?: string;
}

export function getProjects(currentLocale: Locale): Project[] {
  const projectsFromJson = getProjectsData(currentLocale);

  // Plus besoin de projectsDetails ! Tout vient du JSON maintenant
  return projectsFromJson.map((project) => ({
    titre: project.titre,
    description: project.description,
    keywords: project.keywords,
    image: project.image, // ← Directement du JSON
    github: project.github, // ← Directement du JSON
    githubCTA: project.githubCTA,
    liveUrl: project.liveUrl,
    liveCTA: project.liveCTA,
  }));
}
