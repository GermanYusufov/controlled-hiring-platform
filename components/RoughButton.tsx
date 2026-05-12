"use client";

import { useEffect, useRef } from "react";
import { annotate, RoughAnnotation } from "rough-notation";

interface RoughButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  annotationColor?: string;
}

export default function RoughButton({
  href,
  className,
  children,
  annotationColor = "#18181b",
}: RoughButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    annotationRef.current = annotate(el, {
      type: "box",
      color: annotationColor,
      strokeWidth: 2,
      padding: 4,
      roughness: 0.5,
      animationDuration: 350,
    });

    const show = () => annotationRef.current?.show();
    const hide = () => annotationRef.current?.hide();

    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);

    return () => {
      el.removeEventListener("mouseenter", show);
      el.removeEventListener("mouseleave", hide);
      annotationRef.current?.remove();
    };
  }, [annotationColor]);

  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
}
