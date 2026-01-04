"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../lib/SupabaseClient";
import { Song } from "@/types/song";
import useUserSession from "../../custom-hooks/useUserSession";
import { useContext } from "react";
import { PlayerContext } from "@/layouts/FrontendLayout";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

type RecentlyPlayedProps = {
  onPlay?: (songs: Song[], index: number) => void;  // ? makes optional
};

export default function RecentlyPlayed({ onPlay }: RecentlyPlayedProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const session = useUserSession();
  const userId = session?.session?.user?.id;
  const getLimit = () => (window.innerWidth >= 1024 ? 5 : 4);

  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex, setIsMusicPlaying } = context;

  const fetchRecentlyPlayed = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("recently_played")
      .select("song:songs(*)")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .limit(getLimit());

    if (error) return;

    const mappedSongs: Song[] = data
      ? data.map((row: any) => row.song).filter(Boolean)
      : [];

    setSongs(mappedSongs);
  };

  const startPlayingSong = (songs: Song[], index: number) => {
    setQueue(songs);
    setCurrentIndex(index);
    setIsMusicPlaying(true);
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  }, []);

  useEffect(() => {
  if (!userId) return;

  const channel = supabase
    .channel("recently-played-ui")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "recently_played",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        fetchRecentlyPlayed(); // 🔥 THIS updates UI
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);

  if(songs.length==0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-white text-lg font-semibold mb-3">Continue Listening!</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 hover:cursor-pointer">
        {songs.map((song, index) => (
          <button
            key={song.id}
            onClick={() => startPlayingSong(songs, index)}
            className="bg-neutral-800 p-3 rounded-lg hover:bg-hover transition text-left"
          >
            <div className="flex items-center gap-3">
              {song.cover_image_url && (
                <Image
                  src={song.cover_image_url}
                  alt={song.title}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              )}

              <div className="min-w-0">
                <p className="text-white text-sm truncate">
                  {song.title}
                </p>
                <p className="text-secondary-text text-xs truncate">
                  {song.artist}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
