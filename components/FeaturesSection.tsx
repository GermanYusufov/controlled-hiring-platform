"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

export default function FeaturesSection({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const annotation = annotate(el, {
      type: "box",
      color: "#18181b",
      strokeWidth: 2,
      padding: 12,
      animationDuration: 1000,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          annotation.show();
          observer.disconnect();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      annotation.remove();
    };
  }, []);

  return (
    <div ref={boxRef} className="rounded-[2rem] bg-zinc-50 px-8 py-12">
      {children}
    </div>
  );
}
