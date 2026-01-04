"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/SupabaseClient";
import FrontendLayout from "@/layouts/FrontendLayout";
import PlaysOverTime from "@/components/analytics/PlaysOverTime";
import TopSongs from "@/components/analytics/TopSongs";
import TopLikedSongs from "@/components/analytics/TopLikedSongs";
import TopPodcasts from "@/components/analytics/TopPodcasts";
import TopPodcastEpisodes from "@/components/analytics/TopPodcastEpisodes";
import PodcastPlaysOverTime from "@/components/analytics/PodcastPlaysOverTime";

const ADMIN_EMAILS = [
  "example1@gmail.com",
];

export default function AnalyticsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, []);

  if (authorized === null) {
    return (
      <FrontendLayout>
        <div className="min-h-screen lg:ml-80 pt-24 px-6 text-white">
          Loading analytics…
        </div>
      </FrontendLayout>
    );
  }

  if (!authorized) {
    return (
      <FrontendLayout>
        <div className="min-h-screen lg:ml-80 pt-24 px-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-secondary-text">
            You are not authorized to view analytics.
          </p>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen lg:ml-80 text-white bg-background">

        {/* 🔥 TOP GRADIENT HEADER */}
        <div className="relative">
            <div
            className="
                absolute inset-0
                bg-gradient-to-b
                from-green-600/30
                via-green-500/10
                to-background
                pointer-events-none
            "
            />
        {/* Gradient header already added earlier */}
        <div className="relative px-6 pt-24 pb-8">
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-secondary-text mt-2">
            Insights into listening activity & engagement
          </p>
        </div>

        <div className="px-6 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlaysOverTime />
          <TopSongs />
          <TopLikedSongs />
          <PodcastPlaysOverTime />
          <TopPodcasts />
          <TopPodcastEpisodes />
        </div>
      </div>
      </div>
    </FrontendLayout>
  );
}
