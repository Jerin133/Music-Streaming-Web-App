"use client";

import React, { useContext } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getPodcastEpisodes, getAllPodcasts } from "../../../../lib/podcastApi";
import { Podcast } from "@/types/podcast";
import { PodcastEpisode } from "@/types/podcastEpisode";
import { PlayerContext } from "@/layouts/FrontendLayout";
import FrontendLayout from "@/layouts/FrontendLayout";
import { IoMdPlay } from "react-icons/io";

export default function PodcastPage() {
  const params = useParams();
  const podcastId = Number(params.id);

  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("PlayerContext must be used inside FrontendLayout");
  }

  const { setQueue, setCurrentIndex, setIsMusicPlaying } = context;

  // Fetch all podcasts
  const { data: podcasts } = useQuery({
    queryKey: ["allPodcasts"],
    queryFn: getAllPodcasts,
  });

  const podcast = podcasts?.find(
    (p: Podcast) => p.id === podcastId
  );

  // Fetch episodes
  const {
    data: episodes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["podcastEpisodes", podcastId],
    queryFn: () => getPodcastEpisodes(podcastId),
    enabled: !!podcastId,
  });

  const startPlayingEpisode = (index: number) => {
    if (!episodes || !podcast) return;

    const queue = episodes.map((ep) => ({
        id: ep.id,
        title: ep.title,
        artist: podcast?.author || "Podcast",
        cover_image_url: podcast?.cover_image_url,
        audio_url: ep.audio_url,
    }));

    setQueue(queue as any);
    setCurrentIndex(index);
    setIsMusicPlaying(true);
  };

  if (isLoading) {
    return (
      <FrontendLayout>
        <div className="p-8">
          <div className="animate-pulse bg-hover w-48 h-48 rounded-lg mb-4" />
          <div className="animate-pulse bg-hover w-64 h-8 rounded mb-2" />
          <div className="animate-pulse bg-hover w-48 h-6 rounded" />
        </div>
      </FrontendLayout>
    );
  }

  if (isError) {
    return (
      <FrontendLayout>
        <h1 className="text-center text-white text-2xl">
          {(error as Error).message}
        </h1>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <div className="min-h-screen text-white lg:ml-80 bg-background">

        {/* 🔥 Gradient Header */}
        <div className="bg-gradient-to-b from-[#6e385a] via-background top-24">
          <div className="p-8">

            {/* Podcast Header */}
            <div className="mb-12">
              <div className="flex items-end gap-6">

                {/* Cover */}
                <div className="w-48 h-48 relative rounded-xl overflow-hidden bg-neutral-800 top-10">
                  <Image
                    src={podcast?.cover_image_url || "/default-podcast.png"}
                    alt="Podcast cover"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-3">
                  <h1 className="text-sm uppercase tracking-wide text-secondary-text">
                    Podcast
                  </h1>

                  <h2 className="text-6xl font-black leading-none top-4">
                    {podcast?.title}
                  </h2>

                  <div className="flex items-center gap-2 text-secondary-text text-sm">
                    <span>{podcast?.author || "Unknown author"}</span>
                    <span>•</span>
                    <span>
                      {episodes?.length || 0}{" "}
                      {episodes?.length === 1 ? "episode" : "episodes"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Episodes List */}
            {episodes && episodes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-secondary-text text-xl">
                  No episodes in this podcast yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-8">
                {episodes?.map((episode, index) => (
                  <div
                    key={episode.id}
                    onClick={() => startPlayingEpisode(index)}
                    className="
                      grid grid-cols-[50px_1fr_auto]
                      lg:grid-cols-[50px_1fr_auto_auto]
                      items-center
                      gap-4
                      p-4
                      rounded-lg
                      bg-neutral-800
                      hover:bg-hover
                      cursor-pointer
                      group
                    "
                  >
                    <span className="text-secondary-text font-bold text-lg">
                      {index + 1}
                    </span>

                    <div className="flex flex-col">
                      <p className="font-semibold text-white group-hover:underline truncate">
                        {episode.title || `Episode ${episode.episode_number}`}
                      </p>
                      <p className="text-secondary-text text-sm">
                        {podcast?.author || "Unknown author"}
                      </p>
                    </div>

                    <span className="text-secondary-text text-sm hidden lg:block">
                      <IoMdPlay
                            className="
                            text-white
                            text-xl
                            opacity-100
                            transition
                            "
                        />
                    </span>
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
