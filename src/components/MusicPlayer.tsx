"use client";
import { PlayerContext } from "@/layouts/FrontendLayout";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  IoMdPause,
  IoMdPlay,
  IoMdSkipBackward,
  IoMdSkipForward,
  IoMdVolumeHigh,
  IoMdVolumeOff,
} from "react-icons/io";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { MdOutlineQueueMusic } from "react-icons/md";
import { supabase } from "../../lib/SupabaseClient";

export default function MusicPlayer() {
  const audioref = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsplaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previousVolume, setPreviousVolume] = useState(75);
  const [repeatSong, setRepeatSong] = useState(true);
  const context = useContext(PlayerContext);
  const hasLoggedPlay = useRef(false);

  const savePodcastPlay = async (episodeId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("podcast_episode_plays").insert({
      podcast_id: currentMusic.podcast_id,
      episode_id: episodeId,
    });
  };

  const saveRecentlyPlayed = async (songId: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("recently_played")
      .upsert(
        {
          user_id: user.id,
          song_id: songId,
          played_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,song_id",
        }
      );
  };

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const {
    currentMusic,
    playNext,
    playPrevious,
    setQueueModal,
    queueModal,
  } = context as any;

  //   function to pause and play
  const togglePlayButton = () => {
    if (!audioref.current) return;

    if (isPlaying) {
      audioref.current.pause(); // ⏸ Pause the song
    } else {
      audioref.current.play(); // ▶️ Play the song
    }

    setIsplaying(!isPlaying); // 🔄 Toggle the play state in React
  };

  // function to control volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value); // 🎚 Get value from slider (0–100)
    setVolume(vol); // 🔁 Update volume state
    if (audioref.current) {
      audioref.current.volume = vol / 100; // 🔊 Set actual audio volume (0–1)
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60); // ⏱ Get minutes
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0"); // ⏱ Get seconds and format to 2 digits
    return `${minutes}:${seconds}`; // 🕓 Return formatted time (e.g., 2:05)
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value); // 🎯 Get new time from seek slider
    if (audioref.current) {
      audioref.current.currentTime = newTime; // ⏩ Skip audio to that time
      setCurrentTime(newTime); // 🕑 Update current time state
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      // 🔈 Unmute
      setVolume(previousVolume);
      if (audioref.current) {
        audioref.current.volume = previousVolume / 100;
      }
    } else {
      // 🔇 Mute
      setPreviousVolume(volume);
      setVolume(0);
      if (audioref.current) {
        audioref.current.volume = 0;
      }
    }
  };

  useEffect(() => {
    if (audioref.current) {
      audioref.current.volume = volume / 100; // 🔄 Keep audio volume in sync with React state
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioref.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime); // 🕑 Update current time (every second)
      setDuration(audio.duration || 0); // 🕒 Set total duration once loaded
    };

    // 🧲 Listen for time updates and when metadata is loaded
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      // 🔌 Clean up listeners
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, [currentMusic]);


  //useEffect for when song ends
  useEffect(() => {
    const audio = audioref.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatSong) {
        audio.currentTime = 0; // ⏮️ Reset to beginning
        audio.play(); // 🔁 Repeat the same song
      } else {
        playNext(); // ⏭️ Move to the next song in queue
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded); // 🧹 Cleanup on unmount or dependency change
    };
  }, [repeatSong, playNext]);

  useEffect(() => {
    hasLoggedPlay.current = false;
  }, [currentMusic]);

  // useEffect for when a new song is seleted
  useEffect(() => {
    const audio = audioref.current;
    if (!audio || !currentMusic?.audio_url) return;

    audio.play().then(() => {
      setIsplaying(true);
    }).catch(() => {
      setIsplaying(false);
    });
  }, [currentMusic]);

  if (currentMusic) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-3 shadow-md z-50">
        {currentMusic?.audio_url && (
          <audio
            ref={audioref}
            src={currentMusic.audio_url}
            onPlay={() => {
              if (hasLoggedPlay.current) return;
              hasLoggedPlay.current = true;

              if ((currentMusic as any).podcast_id) {
                savePodcastPlay(Number(currentMusic.id));
              } else {
                saveRecentlyPlayed(Number(currentMusic.id));
              }
            }}
          />
        )}
        <div className="max-w-8xl w-[95%] mx-auto flex flex-col md:flex-row gap-4 md:gap-0  items-center justify-between ">
          {/* song info */}
          <div className="flex gap-4 items-center relative">
            <Image
              src={currentMusic?.cover_image_url || "/default-podcast.png"}
              width={500}
              height={500}
              alt="cover-image"
              className="w-13 h-13 object-cover rounded-md"
            />
            <div className="text-sm">
              <p className="text-white">{currentMusic.title}</p>
              <p className="text-secondary-text font-normal">
                {currentMusic.artist}
              </p>
            </div>
          </div>

          {/* song progress and controls */}
          <div className="max-w-[400px] w-full flex items-center flex-col gap-3">
            <div className="flex gap-4">
              <button
                onClick={playPrevious}
                className="text-xl text-secondary-text"
              >
                <IoMdSkipBackward />
              </button>
              <button
                onClick={togglePlayButton}
                className="text-xl bg-white text-black w-10 h-10 rounded-full grid place-items-center"
              >
                {isPlaying ? <IoMdPause /> : <IoMdPlay />}
              </button>
              <button
                onClick={playNext}
                className="text-xl text-secondary-text"
              >
                <IoMdSkipForward />
              </button>
            </div>
            <div className="w-full flex justify-center items-center gap-2">
              <span className="text-sm font-normal text-secondary-text">
                {formatTime(currentTime)}
              </span>
              <div className="w-full">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full outline-none  h-1 bg-zinc-700 rounded appearance-none accent-white"
                />
              </div>

              <span className="text-sm font-normal text-secondary-text">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* volume control */}
          <div className="flex items-center gap-2">
            {repeatSong ? (
              <button
                onClick={() => setRepeatSong(false)}
                className="text-primary"
              >
                <LuRepeat1 />
              </button>
            ) : (
              <button onClick={() => setRepeatSong(true)}>
                <LuRepeat />
              </button>
            )}

            <button
              onClick={() => setQueueModal(!queueModal)}
              className="text-secondary-text text-xl cursor-pointer"
            >
              <MdOutlineQueueMusic />
            </button>
            {volume === 0 ? (
              <button className="text-secondary-text text-xl cursor-pointer">
                <IoMdVolumeOff onClick={toggleMute} />
              </button>
            ) : (
              <button className="text-secondary-text text-xl cursor-pointer">
                <IoMdVolumeHigh onClick={toggleMute} />
              </button>
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-[100px] outline-none h-1 bg-zinc-700 rounded appearance-none accent-white"
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
}
