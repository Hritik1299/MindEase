import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function VoiceRoom() {
  const [joined, setJoined] = useState(false);
  const [localTrack, setLocalTrack] = useState(null);

  const joinChannel = async () => {
    const channel = "mindease_room";
    try {
      const res = await axios.get(`http://localhost:5000/agora-token?channel=${channel}`);
      const { appId, token } = res.data;

      await client.join(appId, channel, token, null);
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      await client.publish(audioTrack);
      setLocalTrack(audioTrack);
      setJoined(true);
    } catch (err) {
      console.error(err);
      alert("Failed to join voice session.");
    }
  };

  const leaveChannel = async () => {
    try {
      await client.leave();
      localTrack?.stop();
      localTrack?.close();
      setJoined(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-purple-200">
      <h2 className="text-lg font-semibold mb-1">🎙️ Voice Session</h2>
      <p className="text-sm text-gray-600 mb-3">
        Talk aloud and let MindEase listen & respond.
      </p>

      {!joined ? (
        <button
          onClick={joinChannel}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow"
        >
          Join Voice Room
        </button>
      ) : (
        <button
          onClick={leaveChannel}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow"
        >
          Leave Room
        </button>
      )}
    </div>
  );
}
