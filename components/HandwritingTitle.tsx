"use client";

import { useEffect, useState } from "react";
import { Penflow } from "penflow/react";

export default function HandwritingTitle() {
  const [penSize, setPenSize] = useState(72);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      setPenSize(w < 400 ? 40 : w < 640 ? 52 : w < 1024 ? 64 : 72);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flex justify-center mb-4 w-full overflow-hidden px-2">
      <Penflow
        text="Sachok Job"
        fontUrl="/fonts/Caveat.ttf"
        quality="balanced"
        seed="sachok"
        size={penSize}
      />
    </div>
  );
}
