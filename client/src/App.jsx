import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import VoiceRoom from "./components/VoiceRoom";
import MoodChart from "./components/MoodChart";
import Avatar from "./components/Avatar";

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

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const endRef = useRef(null);

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  };

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const loadVoices = () => {
      const list = speechSynthesis.getVoices();
      setVoices(list);
      if (list.length > 0 && !selectedVoice) setSelectedVoice(list[0]);
    };
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // Mood-based theme
  const getMoodTheme = () => {
    const latest = moodHistory[moodHistory.length - 1];
    if (!latest) return "neutral";

    if (latest.mood <= -2) return "sad";
    if (latest.mood >= 2) return "happy";

    return "neutral";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    stopSpeaking();

    const text = input;
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", { message: text });
      const { reply, moodScore } = res.data;

      setMessages(prev => [...prev, { sender: "ai", text: reply }]);
      setMoodHistory(prev => [
        ...prev,
        { mood: moodScore, time: new Date().toISOString() }
      ]);

      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(reply);
        if (selectedVoice) utter.voice = selectedVoice;
        speechSynthesis.speak(utter);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "ai", text: "Server error." }]);
    } finally {
      setLoading(false);
    }
  };

  const theme = getMoodTheme();

  return (
    <div
      className={`
        min-h-screen text-white flex flex-col items-center p-6 transition-all duration-700
        ${
          theme === "sad"
            ? "bg-gradient-to-b from-blue-900 via-gray-900 to-black"
            : theme === "happy"
            ? "bg-gradient-to-b from-purple-600 via-pink-600 to-red-500"
            : "bg-gradient-to-b from-black via-gray-900 to-black"
        }
      `}
    >
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-full px-6 py-3">
          <h1 className="text-xl font-semibold text-purple-200">
            MindEase 💬
          </h1>
        </div>
      </div>

      {/* Main layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* CHAT WINDOW */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 flex flex-col min-h-[580px]"
        >
          <h2 className="text-lg font-medium mb-3 text-purple-200">Conversation</h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                
                {/* Avatar */}
                {msg.sender === "ai" && (
                  <Avatar
                    type="ai"
                    mood={theme}
                    pulsing={loading && i === messages.length - 1}
                  />
                )}

                {/* Message Bubble */}
                <div
                  className={`
                    px-4 py-3 rounded-2xl max-w-[75%] backdrop-blur-xl shadow-lg border border-white/10
                    ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 text-gray-200"
                    }
                  `}
                >
                  {msg.text}
                </div>

                {/* User Avatar */}
                {msg.sender === "user" && <Avatar type="user" mood={theme} />}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-300">
                <Avatar type="ai" mood={theme} pulsing={true} />
                <span className="italic">typing…</span>
              </div>
            )}

            <div ref={endRef}></div>
          </div>

          {/* Input Row */}
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type your feelings..."
                className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white"
              />

              <motion.button
                onClick={sendMessage}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
              >
                Send
              </motion.button>

              <motion.button
                onClick={stopSpeaking}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-2 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
              >
                Stop
              </motion.button>
            </div>

            {/* Voice selector */}
            <select
              value={selectedVoice?.name}
              onChange={e => setSelectedVoice(voices.find(v => v.name === e.target.value))}
              className="px-3 py-2 rounded bg-white/10 border border-white/20"
            >
              {voices.map((voice, i) => (
                <option key={i} value={voice.name} className="text-black">
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-8">

          {/* Voice Room */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6"
          >
            <VoiceRoom />
          </motion.div>

          {/* Mood Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6"
          >
            <h2 className="text-lg font-medium mb-3 text-purple-200">Mood Chart</h2>
            <MoodChart data={moodHistory} />
          </motion.div>
        </div>
      </div>

      <footer className="mt-10 text-gray-300 text-sm">
        © 2025 MindEase • Avatar Pulse Edition
      </footer>
    </div>
  );
}
