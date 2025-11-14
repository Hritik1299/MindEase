import React from "react";

// Avatar component with pulse + glow
export default function Avatar({ type, mood, pulsing }) {
  
  const moodColor =
    mood === "happy"
      ? "from-pink-400 to-purple-500"
      : mood === "sad"
      ? "from-blue-400 to-indigo-600"
      : "from-purple-500 to-indigo-500";

  return (
    <div
      className={`
        w-10 h-10 rounded-full bg-gradient-to-br ${moodColor}
        flex items-center justify-center text-white font-bold shadow-lg
        ${pulsing ? "animate-pulse-glow" : ""}
      `}
    >
      {type === "ai" ? "💬" : "🙂"}
    </div>
  );
}
