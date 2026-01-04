"use client";

import FrontendLayout from "@/layouts/FrontendLayout";

export default function PodcastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FrontendLayout>{children}</FrontendLayout>;
}