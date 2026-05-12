"use client";

import { useEffect, useRef, useState } from "react";
import { Penflow } from "penflow/react";

export default function TenAnimated() {
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
    <div ref={ref} style={{ width: 500, overflow: "hidden", margin: "0 auto" }}>
      <div style={{ transform: "translateX(20px)" }}>
        <Penflow
          text="10"
          fontUrl="/fonts/Caveat.ttf"
          quality="high"
          seed="ten"
          size={320}
          animate={playheadKey > 0}
          playheadKey={playheadKey}
          autoReplay={false}
        />
      </div>
    </div>
  );
}

