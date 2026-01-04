"use client";

import FrontendLayout from "@/layouts/FrontendLayout";

export default function LikedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FrontendLayout>{children}</FrontendLayout>;
}
