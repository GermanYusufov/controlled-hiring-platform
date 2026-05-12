"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

interface RoughButtonElProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  annotationColor?: string;
}

export default function RoughButtonEl({
  onClick,
  disabled,
  className,
  children,
  annotationColor = "#18181b",
}: RoughButtonElProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const annotationRef = useRef<ReturnType<typeof annotate> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    annotationRef.current = annotate(el, {
      type: "box",
      color: annotationColor,
      strokeWidth: 2,
      padding: 4,
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
  }, [disabled, annotationColor]);

  return (
    <button ref={ref} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
