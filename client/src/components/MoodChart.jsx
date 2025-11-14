import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

export default function MoodChart({ data }) {
  const formatted = data.map((d, i) => ({
    index: i + 1,
    mood: d.mood,
  }));

  return (
    <div className="bg-white p-5 rounded-3xl shadow-xl border border-purple-200">
      <h2 className="text-lg font-semibold mb-3">📊 Mood Trend</h2>

      {formatted.length === 0 ? (
        <p className="text-gray-500 italic text-sm">No mood data yet.</p>
      ) : (
        <div className="h-48">
          <ResponsiveContainer>
            <LineChart data={formatted}>
              <YAxis domain={[-10, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={{ stroke: "#7C3AED", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
