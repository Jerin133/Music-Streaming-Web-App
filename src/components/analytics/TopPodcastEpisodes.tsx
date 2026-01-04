"use client";

import { supabase } from "../../../lib/SupabaseClient";
import { useEffect, useState } from "react";

export default function TopPodcastEpisodes() {
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("analytics_top_podcast_episodes")
      .select("*")
      .limit(5)
      .then(({ data }) => setEpisodes(data || []));
  }, []);

  return (
    <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-3">Top Podcast Episodes</h2>

      <ul className="space-y-2">
        {episodes.map((e) => (
          <li key={e.episode_id} className="flex justify-between">
            <span>{e.episode_title}</span>
            <span className="text-secondary-text">{e.play_count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
