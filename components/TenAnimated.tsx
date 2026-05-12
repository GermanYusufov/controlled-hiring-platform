"use client";

import { useEffect, useRef, useState } from "react";
import { Penflow } from "penflow/react";

export default function TenAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const [playheadKey, setPlayheadKey] = useState(0);
  const triggered = useRef(false);
  const [penSize, setPenSize] = useState(220);

  useEffect(() => {
    const updateSize = () => setPenSize(window.innerWidth < 640 ? 160 : 220);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setPlayheadKey((k) => k + 1);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full max-w-xs sm:max-w-sm overflow-hidden mx-auto">
      <Penflow
        text="10"
        fontUrl="/fonts/Caveat.ttf"
        quality="balanced"
        seed="ten"
        size={penSize}
        animate={playheadKey > 0}
        playheadKey={playheadKey}
        autoReplay={false}
      />
    </div>
  );
}

