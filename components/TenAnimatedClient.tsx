"use client";

import dynamic from "next/dynamic";

const TenAnimated = dynamic(() => import("./TenAnimated"), { ssr: false });

export default function TenAnimatedClient() {
  return <TenAnimated />;
}
