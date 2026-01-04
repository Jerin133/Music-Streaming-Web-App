"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAllPodcasts } from "../../lib/podcastApi";
import { Podcast } from "@/types/podcast";
import Link from "next/link";

export default function AllPodcasts() {
  const { data: podcasts, isLoading, isError, error } = useQuery({
    queryKey: ["allPodcasts"],
    queryFn: getAllPodcasts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-background p-3 rounded-md animate-pulse h-56"
          >
            <div className="w-full h-40 bg-hover rounded-md mb-2" />
            <div className="h-3 w-3/4 bg-hover rounded-md mb-1" />
            <div className="h-3 w-1/2 bg-hover rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <h1 className="text-center text-white text-2xl">
        {(error as Error).message}
      </h1>
    );
  }

  if (!podcasts || podcasts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {podcasts.map((podcast: Podcast) => (
          <Link
            key={podcast.id}
            href={`/podcasts/${podcast.id}`}
            className="bg-background p-3 cursor-pointer rounded-md hover:bg-hover"
          >
            <Image
              src={podcast.cover_image_url || "/default-podcast.png"}
              alt="podcast-cover"
              width={500}
              height={500}
              className="w-full h-50 object-cover rounded-md"
            />
            <div className="mt-2">
              <p className="text-primary-text font-semibold line-clamp-1">
                {podcast.title}
              </p>
              <p className="text-secondary-text text-sm line-clamp-1">
                {podcast.author || "Unknown"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}