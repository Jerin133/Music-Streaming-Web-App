import { supabase } from "./SupabaseClient";
import { Song } from "@/types/song";

export async function createPlaylist(name: string, userId: string) {
  const { data, error } = await supabase
    .from("playlists")
    .insert({ name, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPlaylists(userId: string) {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addSongToPlaylist(
  playlistId: string,
  songId: number,
  userId: string
) {
  const { data, error } = await supabase
    .from("playlist_songs")
    .insert({ playlist_id: playlistId, song_id: songId, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlaylistSongs(
    playlistId: string,
    userId: string
    ): Promise<Song[]> {
    const { data, error } = await supabase
        .from("playlist_songs")
        .select("songs(*)")
        .eq("playlist_id", playlistId)
        .eq("user_id", userId);

    if (error) throw error;

    // data is any[] | null -> normalise then map
    const rows = (data ?? []) as any[];
    return rows.map((row) => row.songs as Song);
    }

export async function deletePlaylist(id: string, userId: string) {
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function likeSong(songId: number, userId: string) {
  const { error } = await supabase
    .from("liked_songs")
    .insert({ song_id: songId, user_id: userId });

  if (error) throw error;
}

export async function unlikeSong(songId: number, userId: string) {
  const { error } = await supabase
    .from("liked_songs")
    .delete()
    .eq("song_id", songId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getLikedSongs(userId: string) {
  const { data, error } = await supabase
    .from("liked_songs")
    .select("songs(*)")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((row) => row.songs);
}