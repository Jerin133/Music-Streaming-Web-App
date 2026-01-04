"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../../lib/SupabaseClient";
import { useEffect, useState } from "react";

export default function PlaysOverTime() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("analytics_plays_per_day")
      .select("*")
      .then(({ data }) => setData(data || []));
  }, []);

  return (
    <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
      <h2 className="text-lg font-semibold mb-3">Plays Over Time</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_plays" stroke="#1DB954" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
