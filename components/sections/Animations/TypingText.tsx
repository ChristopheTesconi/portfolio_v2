// components/sections/Animations/TypingText.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../Home/Home.module.css";

interface TypingTextProps {
  text: string;
  delay?: number;
  reducedMotion?: boolean;
}

export default function TypingText({
  text,
  delay = 0,
  reducedMotion = false,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState(() =>
    reducedMotion ? text : "",
  );
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

  if (reducedMotion) {
    return <p className={styles.introSignature}>{text}</p>;
  }

  return (
    <p className={styles.introSignature}>
      <span className={styles.signatureGhost} aria-hidden="true">
        {text}|
      </span>
      <span className={styles.signatureTyped}>
        {displayedText}
        <span
          className={cursorVisible ? styles.cursorVisible : styles.cursorHidden}
        >
          |
        </span>
      </span>
    </p>
  );
}
