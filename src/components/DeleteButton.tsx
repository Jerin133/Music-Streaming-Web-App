"use client";

import React from "react";
import { FaTrash } from "react-icons/fa6";
import { supabase } from "../../lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

type DeleteButtonProps =
  | {
      type: "song";
      songId: string;
      imagePath: string;
      audioPath: string;
    }
  | {
      type: "playlist";
      playlistId: string;
      onDeleted?: () => void;
    }
  | {
      type: "playlist-song";
      playlistId: string;
      songId: number;
      onDeleted?: () => void;
    }
  | {
      type: "liked-song";
      songId: number;
      onDeleted?: () => void;
    };

export default function DeleteButton(props: DeleteButtonProps) {
  const queryClient = useQueryClient();

  const deleteSong = async (
    songId: string,
    imagePath: string,
    audioPath: string
  ) => {
    await supabase.storage.from("cover-images").remove([imagePath]);
    await supabase.storage.from("songs").remove([audioPath]);

    const { error } = await supabase.from("songs").delete().eq("id", songId);
    if (error) {
      console.error(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["userSongs"] });
    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
  };

  const deletePlaylist = async (playlistId: string) => {
  const { error: psError } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId);

  if (psError) {
    console.error(psError.message);
    return;
  }

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    console.error(error.message);
    return;
  }
};

const removeSongFromPlaylist = async (
  playlistId: string,
  songId: number
) => {
  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);

  if (error) {
    console.error(error.message);
    return;
  }
};

const handleDelete = async () => {
  if (props.type === "song") {
    await deleteSong(
      props.songId,
      props.imagePath,
      props.audioPath
    );
  }

  if (props.type === "playlist") {
    await deletePlaylist(props.playlistId);
    props.onDeleted?.();
  }

  if (props.type === "playlist-song") {
    await removeSongFromPlaylist(
      props.playlistId,
      props.songId
    );
    props.onDeleted?.();
  }

  if (props.type === "liked-song") {
    await deleteLikedSong(props.songId);
    props.onDeleted?.();
  }
};

const deleteLikedSong = async (songId: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("liked_songs")
    .delete()
    .eq("user_id", user.id)
    .eq("song_id", songId);

  if (error) {
    console.error(error.message);
    return;
  }
};

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
      className="text-secondary-text absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer opacity-100 transition"
    >
      <FaTrash />
    </button>
  );
}
