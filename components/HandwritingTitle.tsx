"use client";

import { Penflow } from "penflow/react";

export default function HandwritingTitle() {
  return (
    <div className="flex justify-center mb-4">
      <Penflow
        text="Sachok Job"
        fontUrl="/fonts/Caveat.ttf"
        quality="balanced"
        seed="sachok"
      />
    </div>
  );
}
