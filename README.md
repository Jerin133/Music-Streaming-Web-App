# 🎧 BeatMix – Music & Podcast Streaming Web App

A full-stack **Spotify-like music and podcast streaming web application** built with modern web technologies.  
Users can stream songs and podcasts, manage playlists, like tracks, and view analytics — all with a sleek, responsive UI.

---

## 🚀 Features

### 🎶 Music
- Stream songs with play / pause / next / previous controls
- Like / unlike songs
- Add songs to playlists
- Recently played history
- Volume control & seek bar

### 🎙️ Podcasts
- Browse podcasts & episodes
- Play podcast episodes using the same player
- Episode-level analytics
- Podcast analytics dashboard

### 📊 Analytics (Admin Only)
- Plays over time (songs & podcasts)
- Top played songs
- Most liked songs
- Top podcasts
- Top podcast episodes

### 🔐 Authentication
- Supabase Auth (Email/Password)
- Role-based access for analytics
- Secure Row Level Security (RLS)

### 🎨 UI / UX
- Spotify-style layout & player
- Responsive design (Desktop & Mobile)
- Smooth hover interactions

---

## 🧰 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **React Query**
- **Recharts**
- **React Icons**

### Backend & Services
- **Supabase**
  - PostgreSQL
  - Authentication
  - Storage
  - Row Level Security (RLS)

---

## 🗂️ Database Tables

- `users`
- `songs`
- `liked_songs`
- `playlists`
- `playlist_songs`
- `recently_played`
- `podcasts`
- `podcast_episodes`
- `podcast_episode_plays`

### Analytics Views
- `analytics_plays_per_day`
- `analytics_top_songs`
- `analytics_top_liked_songs`
- `analytics_top_podcasts`
- `analytics_top_podcast_episodes`
- `analytics_podcast_plays_per_day`

---