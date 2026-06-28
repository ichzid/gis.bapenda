"use client";

import TopNav from "@/components/pbb/TopNav";
import React from "react";

export default function PbbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
