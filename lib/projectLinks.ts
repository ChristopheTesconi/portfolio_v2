// lib/projectLinks.ts
import { getProjectsData, type Locale } from "@/lib/i18n";

export interface ProjectLink {
  name: string;
  url: string;
}

export interface TextPart {
  text: string;
  url?: string;
}

// Le nom d'un projet est le début de son titre, avant " – "
// (ex. "Zenevents.ch – Place de marché événementielle" → "Zenevents.ch").
const TITLE_SEPARATOR = " – ";

// Projets qui ont un site en ligne : leur nom devient cliquable partout où il est cité.
export function getProjectLinks(locale: Locale): ProjectLink[] {
  return getProjectsData(locale)
    .filter((project) => project.liveUrl !== "")
    .map((project) => ({
      name: project.titre.split(TITLE_SEPARATOR)[0],
      url: project.liveUrl,
    }));
}

// Découpe un texte en morceaux : texte simple, ou nom de projet avec son adresse.
export function splitByProjectNames(
  text: string,
  links: ProjectLink[],
): TextPart[] {
  const parts: TextPart[] = [];
  let rest = text;

  while (rest.length > 0) {
    let firstIndex = -1;
    let firstLink: ProjectLink | undefined;

    for (const link of links) {
      const index = rest.indexOf(link.name);
      if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
        firstIndex = index;
        firstLink = link;
      }
    }

    if (!firstLink) {
      parts.push({ text: rest });
      break;
    }

    if (firstIndex > 0) {
      parts.push({ text: rest.slice(0, firstIndex) });
    }
    parts.push({ text: firstLink.name, url: firstLink.url });
    rest = rest.slice(firstIndex + firstLink.name.length);
  }

  return parts;
}
