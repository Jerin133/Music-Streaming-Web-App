import { supabase } from "./SupabaseClient";
import { Podcast } from "@/types/podcast";
import { PodcastEpisode } from "@/types/podcastEpisode";

export const getAllPodcasts = async () => {
  const { data, error } = await supabase.from("podcasts").select("*");
  if (error) {
    console.log("FetchAllPodcastsError", error.message);
    throw error;
  }
  return data as Podcast[];
};

export const getPodcastEpisodes = async (podcastId: number) => {
  const { data, error } = await supabase
    .from("podcast_episodes")
    .select("*")
    .eq("podcast_id", podcastId)
    .order("episode_number", { ascending: true });

  if (error) {
    console.log("FetchPodcastEpisodesError", error.message);
    throw error;
  }
  return data as PodcastEpisode[];
};