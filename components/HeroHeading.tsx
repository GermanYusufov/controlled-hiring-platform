"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

export default function HeroHeading() {
  const fairRef = useRef<HTMLSpanElement>(null);
  const controlledRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fairRef.current || !controlledRef.current) return;

    const fairAnnotation = annotate(fairRef.current, {
      type: "underline",
      color: "#18181b",
      strokeWidth: 2.5,
      padding: 2,
      animationDuration: 600,
    });

    const controlledAnnotation = annotate(controlledRef.current, {
      type: "underline",
      color: "#18181b",
      strokeWidth: 2.5,
      padding: 2,
      animationDuration: 600,
    });

    const timer = setTimeout(() => {
      fairAnnotation.show();
      setTimeout(() => controlledAnnotation.show(), 300);
    }, 300);

    return () => {
      clearTimeout(timer);
      fairAnnotation.remove();
      controlledAnnotation.remove();
    };
  }, []);

  return (
    <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
      Hiring that&apos;s <span ref={fairRef}>fair</span>,
      <br />
      consistent, and <span ref={controlledRef}>controlled</span>.
    </h1>
  );
}
