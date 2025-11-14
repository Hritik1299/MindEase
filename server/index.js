const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const Sentiment = require("sentiment");
const dotenv = require("dotenv");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sentiment = new Sentiment();

// === OpenAI chat endpoint ===
app.post("/chat", async (req, res) => {
  try {
    const userMsg = req.body.message || "";
    const moodScore = sentiment.analyze(userMsg).score;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a kind, supportive mental health companion." },
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();
    console.log("🔍 OPENAI RAW RESPONSE:", data); // <-- THIS SHOWS PHYSICAL ERROR

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "Sorry, I couldn't reply at the moment.";

    res.json({ reply, moodScore });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "Server error", moodScore: 0 });
  }
});


// === Agora token generation endpoint ===
app.get("/agora-token", (req, res) => {
  const channelName = req.query.channel;
  if (!channelName) {
    return res.status(400).json({ error: "channel query param is required" });
  }

  try {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const uid = 0; // 0 means Agora will assign ephemeral uid, okay for simple use
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 60 * 60; // token valid for 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID, appCertificate, channelName, uid, role, privilegeExpireTs
    );

    res.json({ token, appId: appID });
  } catch (err) {
    console.error("Agora token error:", err);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
