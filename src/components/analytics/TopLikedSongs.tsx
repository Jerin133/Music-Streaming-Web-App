"use client";

import { supabase } from "../../../lib/SupabaseClient";
import { useEffect, useState } from "react";

export default function TopLikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("analytics_top_liked_songs")
      .select("*")
      .limit(5)
      .then(({ data }) => setSongs(data || []));
  }, []);

  return (
    <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
      <h2 className="text-lg font-semibold mb-3">Most Liked Songs</h2>

      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id} className="flex justify-between">
            <span>{song.title} — {song.artist}</span>
            <span className="text-secondary-text">{song.like_count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
