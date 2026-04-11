// hooks/useReducedMotion.ts
"use client";

import { useSyncExternalStore } from "react";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true, // SSR fallback : pas d'animation côté serveur = contenu visible
  );
}
