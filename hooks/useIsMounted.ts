"use client";

import { useState, useEffect } from "react";

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Cas légitime : synchronisation avec le browser (détection SSR vs client)
    // https://github.com/facebook/react/issues/34743
    setIsMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return isMounted;
}
