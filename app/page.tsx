"use client";
import dynamic from "next/dynamic";

const DynamicEntry = dynamic(() => import("./dynamic"), {
  ssr: false,
});

export default function Page() {
  return <DynamicEntry />;
}
