"use client";

import dynamic from "next/dynamic";

const JobOfferTitle = dynamic(() => import("./JobOfferTitle"), { ssr: false });

export default function JobOfferTitleClient() {
  return <JobOfferTitle />;
}
