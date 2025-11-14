import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function VoiceRoom() {
  const [joined, setJoined] = useState(false);
  const [localTrack, setLocalTrack] = useState(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") user.audioTrack?.play();
    });

    return () => client.removeAllListeners();
  }, []);

  const joinChannel = async () => {
    const channel = "mindease_room";
    try {
      const res = await axios.get(`http://localhost:5000/agora-token?channel=${channel}`);
      const { appId, token } = res.data;

      await client.join(appId, channel, token, null);
      const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish(micTrack);

      setLocalTrack(micTrack);
      setJoined(true);
      setMuted(false);

    } catch (err) {
      console.error(err);
      alert("Voice join failed");
    }
  };

  const leaveChannel = async () => {
    try {
      localTrack?.stop();
      localTrack?.close();
      await client.leave();

      setJoined(false);
      setMuted(false);

    } catch (err) {
      console.error(err);
    }
  };

  const toggleMute = async () => {
    if (!localTrack) return;

    if (muted) {
      await localTrack.setEnabled(true);
      setMuted(false);
    } else {
      await localTrack.setEnabled(false);
      setMuted(true);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-purple-300 mb-2">🎙️ Voice Session</h2>
      <p className="text-sm text-gray-300 mb-4">
        Speak naturally — MindEase listens privately.
      </p>

      {!joined ? (
        <button
          onClick={joinChannel}
          className="px-5 py-2 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Join Voice Room
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="px-4 py-2 bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 transition"
          >
            {muted ? "Unmute" : "Mute"}
          </button>

          <button
            onClick={leaveChannel}
            className="px-4 py-2 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition"
          >
            Leave
          </button>
        </div>
      )}
    </div>
  );
}
