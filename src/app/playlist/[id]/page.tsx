'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import  { Song } from '../../../types/song';
import { getPlaylistSongs, getUserPlaylists } from '../../../../lib/playlistApi';
import useUserSession from '../../../../custom-hooks/useUserSession';
import FrontendLayout from '../../../layouts/FrontendLayout';
import DeleteButton from '@/components/DeleteButton';
import { useContext } from "react";
import { PlayerContext } from "@/layouts/FrontendLayout";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const { session } = useUserSession();
  const userId = session?.user.id;

  const [songs, setSongs] = useState<Song[]>([]);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used inside FrontendLayout");
  }

  const { setQueue, setCurrentIndex, setIsMusicPlaying } = context;

  useEffect(() => {
    if (!playlistId || !userId) return;

    const fetchData = async () => {
      try {
        const playlistSongs = await getPlaylistSongs(playlistId, userId);
        setSongs(playlistSongs);

        const allPlaylists = await getUserPlaylists(userId);
        const currentPlaylist = allPlaylists.find((p: any) => p.id === playlistId);
        setPlaylist(currentPlaylist);
      } catch (error) {
        console.error('Failed to fetch playlist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playlistId, userId]);

  if (loading) {
    return (
      <FrontendLayout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-pulse bg-hover w-48 h-48 rounded-lg mb-4" />
          <div className="animate-pulse bg-hover w-64 h-8 rounded mb-2" />
          <div className="animate-pulse bg-hover w-48 h-6 rounded" />
        </div>
      </FrontendLayout>
    );
  }

  const firstSongCover = songs[0]?.cover_image_url || '/api/placeholder/300/300';

  // Exact formatTime from MusicPlayer.tsx [file:39]
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen text-white lg:ml-80 bg-background rounded-lg">
  
        {/* Gradient background (top only) */}
        <div className="bg-gradient-to-b from-[#3b1d6a] via-background">
    
          {/* Page padding */}
            <div className="p-8">
              {/* Playlist Header */}
              <div className="mb-12">
                <div className="flex items-end gap-6">
            
                  {/* Playlist Image */}
                  <div className="w-48 h-48 relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center top-10">
                    {firstSongCover ? (
                      <Image
                        src={firstSongCover}
                        alt="Playlist cover"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-secondary-text text-lg font-bold">...</div>
                    )}
                  </div>

                  {/* Playlist Info */}
                  <div className="flex flex-col gap-3">
                    <h1 className="text-sm uppercase tracking-wide text-secondary-text">
                      Playlist
                    </h1>

                    <h2 className="text-6xl font-black leading-none">
                      {playlist?.name || "Unknown Playlist"}
                    </h2>

                    <div className="flex items-center gap-2 text-secondary-text text-sm">
                      <span>{session?.user.email}</span>
                      <span>•</span>
                      <span>
                        {songs.length} {songs.length === 1 ? "song" : "songs"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Songs List */}
              {songs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-secondary-text text-xl">No songs in this playlist yet.</p>
                  <p className="text-secondary-text mt-2">Add songs from Liked Songs or other playlists.</p>
                </div>
                ) : (
                <div className="space-y-2">
                  {songs.map((song: Song, index: number) => (
                    <div
                      key={`${song.id}-${index}`}
                      className="relative grid grid-cols-[50px_1fr_auto_auto] lg:grid-cols-[50px_1fr_auto_auto_auto] h-27 items-center bg-neutral-800 top-5 gap-4 p-4 hover:bg-hover rounded-lg cursor-pointer group"
                      onClick={() => {
                        setQueue(songs);        // full playlist queue
                        setCurrentIndex(index); // play clicked song
                        setIsMusicPlaying(true);
                      }}
                    >
                      <span className="text-secondary-text font-bold text-lg">{index + 1}</span>
                      <div className="flex items-center gap-4">
                        <Image
                          src={song.cover_image_url}
                          alt={song.title}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-semibold text-white hover:text-primary group-hover:underline truncate max-w-xs">
                            {song.title}
                          </p>
                          <p className="text-secondary-text text-sm truncate max-w-xs">{song.artist}</p>
                        </div>
                      </div>
                      <p className="text-secondary-text hidden lg:block truncate max-w-md">
                        {song.created_at.split('T')[0]}
                      </p>
                      <span className="text-secondary-text text-sm hidden lg:block">3:45</span>
                      <DeleteButton
                        type="playlist-song"
                        playlistId={playlistId}
                        songId={Number(song.id)}
                        onDeleted={() =>
                          setSongs((prev) =>
                            prev.filter((s) => s.id !== song.id)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>
    </FrontendLayout>
  );
}
