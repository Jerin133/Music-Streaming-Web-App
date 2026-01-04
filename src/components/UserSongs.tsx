import Image from "next/image";
import React, { useContext } from "react";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/song";
import DeleteButton from "./DeleteButton";
import { PlayerContext } from "@/layouts/FrontendLayout";
import { addSongToPlaylist, getUserPlaylists } from "../../lib/playlistApi";
import { LuPlus } from "react-icons/lu";
import { CiWarning } from "react-icons/ci";

type UserSongsProps = {
  userId: string | undefined;
  onCreatePlaylist: () => void;
};

export default function UserSongs({ userId, onCreatePlaylist }: UserSongsProps) {

  const context = useContext(PlayerContext);

  const [activeSongId, setActiveSongId] = React.useState<string | null>(null);
  const [playlists, setPlaylists] = React.useState<any[]>([]);
  
    if (!context) {
      throw new Error("PlayerContext must be used within a PlayerProvider");
    }
  
    const { setIsMusicPlaying,setQueue,setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { error, data } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log("FetchUserSongsError:" + error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["userSongs"],
    queryFn: getUserSongs,
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
      <div>
        {[...Array(10)].map((i, index) => (
          <div className="flex gap-2 animate-pulse mb-4"key={index}>
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] bg-hover rounded-md"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h1 className="text-center text-white text-2xl">{error.message}</h1>;

  if (songs?.length === 0)
    return (
      <h1 className="text-center text-white text-sm">
        You have no songs in your library
      </h1>
    );

  return (
    <div>
      {songs?.map((song: Song,index) => {
        return (
          <div
            onClick={() => startPlayingSong(songs,index)}
            key={song.id}
            className="group relative flex items-center gap-2 cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover"
          >
            <DeleteButton
              type="song"
              songId={song.id}
              imagePath={song.cover_image_url}
              audioPath={song.audio_url}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveSongId(activeSongId === song.id ? null : song.id);
              }}
              className="ml-auto text-secondary-text hover:text-primary-text"
            >
              <LuPlus size={16} />
            </button>

            {activeSongId === song.id && (
              <div
                className="absolute right-4 top-12 bg-background border border-hover rounded-md shadow-lg p-2 w-48 z-50"
                onClick={(e) => e.stopPropagation()}
              >
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
                    className="block w-full text-left text-sm text-primary-text hover:bg-hover rounded px-2 py-1"
                  >
                    {playlist.name}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setActiveSongId(null);
                    onCreatePlaylist();
                  }}
                  className="mt-2 w-full text-left text-sm text-secondary-text hover:text-primary-text"
                >
                  + Create playlist
                </button>
              </div>
            )}

            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="object-cover w-10 h-10 rounded-md"
            />
            <div>
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
