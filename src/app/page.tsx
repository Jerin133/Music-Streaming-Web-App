import AllSongs from "@/components/AllSongs";
import FrontendLayout from "@/layouts/FrontendLayout";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import AllPodcasts from "@/components/AllPodcasts";

export default function Home() {
  return (
    <FrontendLayout>
      <div className="min-h-screen lg:ml-80 text-white bg-background">

        {/* 🔥 TOP GRADIENT (same style as Analytics) */}
        <div className="relative">
          <div
            className="
              absolute
              inset-x-0
              top-15
              bottom-0
              bg-gradient-to-b
              from-green-600/30
              via-green-500/10
              to-background
              pointer-events-none
            "
          />

          {/* Header content */}
          <div className="relative px-4 pt-24 pb-8">
            <h1 className="text-3xl font-bold font-serif">🎧 BeatMix</h1>
            <p className="text-secondary-text mt-1">
              Listen to your favorite tracks
            </p>
          </div>
        </div>

        {/* 📄 PAGE CONTENT */}
        <div className="px-4 pb-10">
          <RecentlyPlayed />

          <h2 className="font-semibold text-2xl text-white mb-3">
            All Songs!
          </h2>

          <AllSongs />

          <br/><br/>

          <h2 className="font-semibold text-2xl text-white mb-3">
            All Podcasts!
          </h2>

          <AllPodcasts />
        </div>

      </div>
    </FrontendLayout>
  );
}
