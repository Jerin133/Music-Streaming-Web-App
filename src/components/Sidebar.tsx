"use client";
import Link from "next/link";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MdOutlineLibraryMusic } from "react-icons/md";
import useUserSession from "../../custom-hooks/useUserSession";
import { createPlaylist, getUserPlaylists } from "../../lib/playlistApi";
import { useEffect } from "react";
import DeleteButton from "./DeleteButton";
import { supabase } from "../../lib/SupabaseClient";
import Image from "next/image";
import { BarChart3 } from "lucide-react";
const ADMIN_EMAILS = ["example1@gmail.com"];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, session } = useUserSession();
  const userId = session?.user.id;

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userId) return; // ✅ VERY IMPORTANT

    const fetchPlaylists = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.warn("Session expired, refreshing…");

        const { error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError) {
          console.error("Session refresh failed:", refreshError.message);
          return;
        }
      }

      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch playlists:", error.message);
        return;
      }

      setPlaylists(data || []);
    };

    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
      const checkAdmin = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && ADMIN_EMAILS.includes(user.email ?? "")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      };

      checkAdmin();
    }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (loading)
    return (
      <aside
        className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {[...Array(10)].map((i, index) => (
            <div className="flex gap-2 animate-pulse mb-4" key={index}>
              <div className="w-10 h-10 rounded-md bg-hover"></div>
              <div className="h-5 w-[80%] bg-hover rounded-md"></div>
            </div>
          ))}
        </div>
      </aside>
    );

  return (
    <>
      {session ? (
        <div>
          <button
            className="fixed bottom-5 left-5 bg-black w-12 h-12 grid lg:hidden place-items-center  text-white rounded-full z-50 cursor-pointer "
            onClick={toggleSidebar}
          >
            <MdOutlineLibraryMusic />
          </button>
          <aside
            className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className="p-1 rounded-full hover:bg-hover"
                >
                  <LuPlus size={20} />
                </button>
            </div>

            <Link
              href="/liked"
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-hover"
            >
              <Image
                src="/images/liked.jpg"
                alt="Liked Songs"
                width={40}
                height={40}
                className="rounded-md object-cover"
              />

              <div>
                <p className="text-white font-semibold">Liked Songs</p>
                <p className="text-secondary-text text-sm">Favorites</p>
              </div>
            </Link>
                               
            <div className="mt-4 space-y-1">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-hover transition relative"
                >
                  <Link
                    href={`/playlist/${playlist.id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                      🎵
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-primary-text font-medium truncate">
                        {playlist.name}
                      </p>
                      <p className="text-secondary-text text-xs truncate">
                        Playlist
                      </p>
                    </div>
                  </Link>

                  <DeleteButton
                    type="playlist"
                    playlistId={playlist.id}
                    onDeleted={() =>
                      setPlaylists((prev) =>
                        prev.filter((p) => p.id !== playlist.id)
                      )
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex-1" />

              {/* 🔒 ADMIN-ONLY ANALYTICS LINK */}
              {isAdmin && (
                <Link
                  href="/analytics"
                  className="
                    flex items-center gap-3 px-4 py-2 mx-2 mb-4 rounded-md
                    text-secondary-text hover:text-white
                    hover:bg-hover transition
                  "
                >
                  <BarChart3 size={18} />
                  <span className="font-medium">Analytics</span>
                </Link>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <>
          <div>
            <aside
              className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="text-center py-8">
                <Link
                  href="/login"
                  className="bg-white px-6 py-2 rounded-full font-semibold hover:bg-secondary-text"
                >
                  Login
                </Link>
                <p className="mt-4 text-white">Login to view your library</p>
              </div>
            </aside>
          </div>
        </>
      )}

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg w-80">
            <h3 className="text-primary-text font-semibold mb-2">New playlist</h3>
            <input
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-2 rounded-md bg-hover text-primary-text mb-3"
              placeholder="Playlist name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  setPlaylistName("");
                }}
                className="px-3 py-1 rounded-md bg-hover text-secondary-text"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!userId || !playlistName.trim()) return;
                  const playlist = await createPlaylist(playlistName.trim(), userId);
                  setPlaylists((prev) => [playlist, ...prev]);
                  setShowPlaylistModal(false);
                  setPlaylistName("");
                }}
                className="px-3 py-1 rounded-md bg-primary text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
