import { supabase } from "./SupabaseClient";

export const addSongToLiked = async (
  songId: number,
  userId: string
) => {
  const { error } = await supabase
    .from("liked_songs")
    .insert({
      song_id: songId,
      user_id: userId,
    });

  if (error) {
    // ignore duplicate like
    if (error.code !== "23505") {
      throw error;
    }
  }
};
