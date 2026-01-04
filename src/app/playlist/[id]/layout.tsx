"use client";

import FrontendLayout from "@/layouts/FrontendLayout";

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FrontendLayout>{children}</FrontendLayout>;
}
