"use client";
import React, { useContext } from "react";
import { IoMdPlay } from "react-icons/io";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/song";
import Image from "next/image";
import { PlayerContext } from "@/layouts/FrontendLayout";
import { LuPlus } from "react-icons/lu";
import { addSongToPlaylist, getUserPlaylists } from "../../lib/playlistApi";
import useUserSession from "../../custom-hooks/useUserSession";
import { useSearch } from "@/context/SearchContext";
import { addSongToLiked } from "../../lib/likedSongsApi";

export default function AllSongs() {
  const context = useContext(PlayerContext);
  const { session } = useUserSession();
  const userId = session?.user.id;

  const [activeSongId, setActiveSongId] = React.useState<string | null>(null);
  const [playlists, setPlaylists] = React.useState<any[]>([]);
  const { search } = useSearch();

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setIsMusicPlaying,setQueue,setCurrentIndex} = context;
  const getAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");

    if (error) {
      console.log("FetchAllSongsError:" + error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allSongs"],
    queryFn: getAllSongs,
  });

  React.useEffect(() => {
    if (!userId) return;

    getUserPlaylists(userId)
      .then(setPlaylists)
      .catch(() => setPlaylists([]));
  }, [userId]);

  const startPlayingSong = (songs: Song[],index:number) => {
    setQueue(songs)    
    setIsMusicPlaying(true);
    setCurrentIndex(index);    
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
        {[...Array(15)].map((i, index) => (
          <div key={index}>
            <div className="w-full h-50 object-cover rounded-md bg-hover mb-2"></div>
            <div className="h-3 w-[80%] bg-hover rounded-md"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h1 className="text-center text-white text-2xl">{error.message}</h1>;

  const filteredSongs = songs?.filter((song: Song) => {
  if (!search) return true;

  const q = search.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {filteredSongs?.map((song: Song,index) => {
        return (
          <div
            onClick={() => startPlayingSong(filteredSongs,index)}
            key={song.id}
            className="bg-background p-3 cursor-pointer rounded-md hover:bg-hover relative group"
          >
            <button
              className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute bottom-8 right-5 cursor-pointer
                 opacity-0 group-hover:opacity-100 group-hover:bottom-18
                  transition-all duration-300 ease-in-out"
            >
              <IoMdPlay size={22} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSongId(activeSongId === song.id ? null : song.id);
              }}
              className="absolute top-5 right-5 text-neutral-900 hover:text-primary-text
                        opacity-0 group-hover:opacity-100 transition"
            >
              <LuPlus size={18} />
            </button>

            {activeSongId === song.id && (
              <div
                className="absolute top-8 left-50 bg-white border-hover
                          rounded-md shadow-lg p-2 w-48 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {/* FIXED OPTION */}
                <button
                  onClick={async () => {
                    try {
                      await addSongToLiked(Number(song.id), userId!);
                      setActiveSongId(null);
                    } catch (err) {
                      console.error("AddToLikedError", err);
                    }
                  }}
                  className="block w-full text-left text-sm text-neutral-900
                            hover:bg-neutral-300 rounded px-2 py-1 mb-2"
                >
                  Add to Favorites
                </button>

                <div className="my-2" />

                <p className="text-xs text-secondary-text mb-2">
                  Add to playlist
                </p>

                {playlists.length === 0 && (
                  <p className="text-xs text-secondary-text px-2 py-1">
                    No playlists yet
                  </p>
                )}

                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={async () => {
                      try {
                        await addSongToPlaylist(
                          playlist.id,
                          Number(song.id),
                          userId!
                        );
                        setActiveSongId(null);
                      } catch (err) {
                        console.error("AddSongToPlaylistError", err);
                      }
                    }}
                    className="block w-full text-left text-sm text-neutral-800
                              hover:bg-neutral-300 rounded px-2 py-1"
                  >
                    {playlist.name}
                  </button>
                ))}

                <button
                  onClick={() => {alert("Please, Click the + in Library to create Playlist!!!"); setActiveSongId(null)}}
                  className="mt-2 w-full text-left text-sm text-secondary-text
                            hover:text-primary-text"
                >
                  + Create playlist
                </button>
              </div>
            )}

            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={500}
              height={500}
              className="w-full h-50 object-cover rounded-md"
            />
            <div className="mt-2">
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
