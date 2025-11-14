import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import VoiceRoom from "./components/VoiceRoom";
import MoodChart from "./components/MoodChart";

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi, I'm MindEase. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch {
      return [];
    }
  });

  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: text
      });

      const { reply, moodScore } = res.data;

      setMessages(prev => [...prev, { sender: "ai", text: reply }]);

      setMoodHistory(prev => [
        ...prev,
        { mood: moodScore, time: new Date().toISOString() }
      ]);

      // Text-to-speech
      const utter = new SpeechSynthesisUtterance(reply);
      speechSynthesis.speak(utter);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Sorry, server error. Try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const backgroundGradient = () => {
    const last = moodHistory.at(-1)?.mood || 0;
    if (last > 2)
      return "bg-gradient-to-br from-green-100 to-white";
    if (last < -2)
      return "bg-gradient-to-br from-blue-100 to-white";
    return "bg-gradient-to-br from-purple-100 to-white";
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center ${backgroundGradient()}`}>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6 flex items-center gap-2"
      >
        <span>MindEase</span>
        <span>💬</span>
      </motion.div>

      {/* CHAT CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-5 border border-purple-200"
      >
        <div className="h-[380px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 max-w-[75%] rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-800"
                } shadow`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-sm italic"
            >
              MindEase is typing…
            </motion.div>
          )}

          <div ref={endRef}></div>
        </div>

        {/* Message Input */}
        <div className="flex items-center mt-4 gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type how you're feeling..."
            className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-purple-600 text-white rounded-2xl shadow hover:bg-purple-700 transition"
          >
            Send
          </button>
        </div>
      </motion.div>

      {/* VOICE ROOM */}
      <div className="w-full max-w-xl mt-6">
        <VoiceRoom />
      </div>

      {/* Mood Chart */}
      <div className="w-full max-w-xl mt-6">
        <MoodChart data={moodHistory} />
      </div>
    </div>
  );
}
