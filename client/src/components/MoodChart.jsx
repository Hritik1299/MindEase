import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis
} from "recharts";

export default function MoodChart({ data }) {
  const formatted = data.map((d, i) => ({
    x: i + 1,
    mood: d.mood
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold text-purple-300 mb-4">📊 Mood Trend</h2>

      {formatted.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No mood data yet</p>
      ) : (
        <div style={{ height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={formatted}>
              <YAxis domain={[-10, 10]} stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "12px",
                  color: "white"
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#C084FC"
                strokeWidth={3}
                dot={{ stroke: "#C084FC", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
