import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import frProjects from "@/locales/projects/fr.projects.json";
import enProjects from "@/locales/projects/en.projects.json";

export type Locale = "fr" | "en";

const dictionaries = {
  fr,
  en,
};

const projectsDictionaries = {
  fr: frProjects,
  en: enProjects,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getProjectsData(locale: Locale) {
  return projectsDictionaries[locale].projects;
}

export function getProjectsTitle(locale: Locale) {
  return projectsDictionaries[locale].projectsTitle;
}

export type Dictionary = typeof fr;

// ✅ Type corrigé pour inclure image et github
export type ProjectData = {
  titre: string;
  image: string;
  description: string[];
  keywords?: string[];
  github: string;
  githubCTA: string;
  liveUrl?: string;
  liveCTA?: string;
};
