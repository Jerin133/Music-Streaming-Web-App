"use client";

import { supabase } from "../../../lib/SupabaseClient";
import { useEffect, useState } from "react";

export default function TopPodcasts() {
  const [podcasts, setPodcasts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("analytics_top_podcasts")
      .select("*")
      .limit(5)
      .then(({ data }) => setPodcasts(data || []));
  }, []);

  return (
    <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
      <h2 className="text-lg font-semibold mb-3">Top Podcasts</h2>

      <ul className="space-y-2">
        {podcasts.map((p) => (
          <li key={p.podcast_id} className="flex justify-between">
            <span>{p.title} — {p.author}</span>
            <span className="text-secondary-text">{p.play_count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
