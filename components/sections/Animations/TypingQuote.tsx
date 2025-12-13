"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Home/Home.module.css";

interface TypingQuoteProps {
  text: string;
}

export default function TypingQuote({ text }: TypingQuoteProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    indexRef.current = 0;

    function type() {
      if (indexRef.current === 0) {
        setDisplayedText(""); // Reset uniquement au début du cycle
      }

      setDisplayedText(text.slice(0, indexRef.current + 1));
      indexRef.current += 1;

      if (indexRef.current < text.length) {
        timeoutIdRef.current = setTimeout(type, 90);
      } else {
        restartTimeoutRef.current = setTimeout(() => {
          indexRef.current = 0;
          type();
        }, 7000);
      }
    }

    // Démarrer l'animation avec un micro-délai pour éviter l'appel synchrone
    const startTimeout = setTimeout(type, 0);

    return () => {
      clearTimeout(startTimeout);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    };
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <p className={styles.introQuote}>
      &ldquo;{displayedText}&rdquo;
      <span className={showCursor ? styles.cursorVisible : styles.cursorHidden}>
        |
      </span>
    </p>
  );
}
