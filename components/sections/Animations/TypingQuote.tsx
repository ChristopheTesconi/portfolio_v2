// components/sections/Animations/TypingQuote.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Home/Home.module.css";

interface TypingQuoteProps {
  text: string;
  delay?: number;
  reducedMotion?: boolean;
}

export default function TypingQuote({
  text,
  delay = 0,
  reducedMotion = false,
}: TypingQuoteProps) {
  const [displayedText, setDisplayedText] = useState(() =>
    reducedMotion ? text : "",
  );
  const showCursor = !reducedMotion;
  const [cursorVisible, setCursorVisible] = useState(true);
  const indexRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    indexRef.current = 0;

    function type() {
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

    delayTimeoutRef.current = setTimeout(type, delay * 1000);

    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    };
  }, [text, delay, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [reducedMotion]);

  return (
    <p className={styles.introQuote}>
      &ldquo;{displayedText}&rdquo;
      {showCursor && (
        <span
          className={cursorVisible ? styles.cursorVisible : styles.cursorHidden}
        >
          |
        </span>
      )}
    </p>
  );
}
