// components/shared/LinkedText/LinkedText.tsx
"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/i18n";
import { getProjectLinks, splitByProjectNames } from "@/lib/projectLinks";
import styles from "./LinkedText.module.css";

interface LinkedTextProps {
  text: string;
}

// Affiche un texte en rendant cliquable chaque nom de projet qui a un site en ligne.
export default function LinkedText({ text }: LinkedTextProps) {
  const pathname = usePathname();
  const currentLocale = (pathname?.split("/")[1] || "fr") as Locale;
  const parts = splitByProjectNames(text, getProjectLinks(currentLocale));

  return (
    <>
      {parts.map((part, index) =>
        part.url ? (
          <a
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {part.text}
          </a>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
