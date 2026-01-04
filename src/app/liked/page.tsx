"use client";

import { useEffect, useContext, useState } from "react";
import { PlayerContext } from "@/layouts/FrontendLayout";
import useUserSession from "../../../custom-hooks/useUserSession";
import { getLikedSongs } from "../../../lib/playlistApi";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton";
import { Song } from "@/types/song";

export default function LikedSongsPage() {
  const { session } = useUserSession();
  const userId = session?.user.id;

  const [songs, setSongs] = useState<any[]>([]);
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used inside FrontendLayout");
  }

  const { setQueue, setCurrentIndex, setIsMusicPlaying } = context;

  useEffect(() => {
    if (!userId) return;
    getLikedSongs(userId).then(setSongs);
  }, [userId]);

  return (
    <div className="min-h-screen lg:ml-80 pt-11 bg-background">
      {/* ===== HERO SECTION (same as playlist) ===== */}
      <div className="bg-gradient-to-b from-purple-800 to-background p-8">
        <div className="flex items-end gap-6">
          <div className="w-52 h-52 flex items-center justify-center text-6xl">
            <Image 
            height={800}
            width={500}
            src="/images/liked.jpg"
            alt="logo"
            />
          </div>

          <div className="relative -top-10">
            <p className="uppercase text-sm text-white font-semibold">Favorites</p>
            <h1 className="text-6xl text-white font-black mt-2">Liked Songs</h1>
            <p className="text-secondary-text mt-2">
              {session?.user.email} • {songs.length} songs
            </p>
          </div>
        </div>
      </div>

      {/* ===== SONG LIST ===== */}
        {songs.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-secondary-text text-xl">
            No songs in this section yet.
            </p>
            <p className="text-secondary-text mt-2">
            Add songs from Liked Songs or other playlists.
            </p>
        </div>
        ) : (
        <div className="px-6 lg:px-10 space-y-2 mt-6">
            {songs.map((song: Song, index: number) => (
            <div
                key={`${song.id}-${index}`}
                className="
                relative
                grid grid-cols-[50px_1fr_auto_auto]
                lg:grid-cols-[50px_1fr_auto_auto_auto]
                items-center
                h-25
                bg-neutral-800
                gap-4
                px-4
                rounded-lg
                hover:bg-hover
                cursor-pointer
                group
                "
                onClick={() => {
                setQueue(songs);
                setCurrentIndex(index);
                setIsMusicPlaying(true);
                }}
            >
                {/* index */}
                <span className="text-secondary-text font-bold text-lg">
                {index + 1}
                </span>

                {/* image + title */}
                <div className="flex items-center gap-4 overflow-hidden">
                <Image
                    src={song.cover_image_url}
                    alt={song.title}
                    width={50}
                    height={50}
                    className="rounded-md shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-semibold text-white group-hover:underline truncate">
                    {song.title}
                    </p>
                    <p className="text-secondary-text text-sm truncate">
                    {song.artist}
                    </p>
                </div>
                </div>

                {/* date */}
                <p className="text-secondary-text hidden lg:block truncate">
                {song.created_at.split("T")[0]}
                </p>

                {/* duration */}
                <span className="text-secondary-text text-sm hidden lg:block">
                3:45
                </span>

                {/* delete */}
                <DeleteButton
                type="liked-song"
                songId={Number(song.id)}
                onDeleted={() =>
                    setSongs((prev) => prev.filter((s) => s.id !== song.id))
                }
                />
            </div>
            ))}
        </div>
        )}
    </div>
  );
}
