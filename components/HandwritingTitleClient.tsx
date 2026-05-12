"use client";

import dynamic from "next/dynamic";

const HandwritingTitle = dynamic(() => import("./HandwritingTitle"), { ssr: false });

export default function HandwritingTitleClient() {
  return <HandwritingTitle />;
}
