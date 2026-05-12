"use client";

import { useEffect, useRef, useState } from "react";
import { Penflow } from "penflow/react";

export default function JobOfferTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const [playheadKey, setPlayheadKey] = useState(0);
  const triggered = useRef(false);

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
    <div ref={ref} className="flex justify-center">
      <Penflow
        text="Job Offer"
        fontUrl="/fonts/Caveat.ttf"
        quality="balanced"
        seed="joboffer"
        size={120}
        animate={playheadKey > 0}
        playheadKey={playheadKey}
        autoReplay={false}
      />
    </div>
  );
}
