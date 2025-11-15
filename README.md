🌿 MindEase – AI Mental Health Companion

Your personal AI-powered support system for emotional wellness.

MindEase is a calming AI companion that helps people express their feelings, track their mood, and talk openly about their emotions through empathetic chat, voice interaction, and real-time sentiment tracking.
Built for HackFest 2025.

🌟 Features
💬 Empathetic AI Chat

MindEase uses OpenAI to generate gentle, supportive responses based on the user's emotional state.

🎙️ Voice Interaction (Agora RTC)

Users can join a real-time voice room to talk aloud. MindEase responds using speech synthesis.

📊 Mood Tracking

The app stores mood data and visualizes emotional trends using interactive charts.

🌈 Mood-Based UI

The background theme gently shifts according to the user’s emotional state.

🧠 Sentiment Analysis

Built-in sentiment analysis helps the system understand user mood patterns.

🪄 Beautiful Modern UI

Powered by:

Tailwind CSS

Framer Motion animations

Clean chat bubbles & gradient design

🔐 Privacy First

No personal data is stored on the server. Mood history remains local to the user.

🖼️ Screenshots

 <img width="1917" height="922" alt="image" src="https://github.com/user-attachments/assets/a674e87d-cdaf-4dd6-88f0-4cdc9f2fe481" />
  <img width="647" height="795" alt="Screenshot 2025-11-15 053402" src="https://github.com/user-attachments/assets/344618b1-1183-461c-840f-72636b135808" />


/screenshots
  ├── landing.png
  ├── chat.png
  ├── voice-room.png
  └── mood-chart.png

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Framer Motion

Recharts

Agora RTC SDK

Axios

Backend

Node.js

Express

OpenAI API

Sentiment.js

Agora Access Token generator

📁 Project Structure
mindease/  
 ├── client/        # React frontend   
 │   ├── src/  
 │   │   ├── App.jsx   
 │   │   ├── components/  
 │   │   │   ├── Avatar.jsx  
 │   │   │   ├── VoiceRoom.jsx  
 │   │   │   └── MoodChart.jsx  
 │   │   └── LandingPage.jsx  
 │   └── index.html  
 │
 │
 ├── server/         # Node backend   
 │   ├── index.js   
 │   ├── package.json  
 │   ├── .env  
 │   └── Agora token generator   
 │
 ├── README.md
 └── package.json (optional root)

🔧 Environment Variables

Create a .env file inside the server folder:

OPENAI_API_KEY=your_openai_key_here
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate
PORT=5000


⚠️ Do NOT expose your Agora Certificate or OpenAI key in frontend code.
They must remain on backend only.

🚀 Running the Project Locally
1️⃣ Install Dependencies

Frontend

cd client
npm install


Backend

cd server
npm install

2️⃣ Start Backend (Server)
cd server
npm run dev


Runs on:

http://localhost:5000

3️⃣ Start Frontend (React App)
cd client
npm run dev


Usually runs on:

http://localhost:5173

🔌 API Endpoints
POST /chat

Send a user message → returns AI response + mood score

{
  "message": "I feel anxious"
}

GET /agora-token?channel=roomName

Returns a token + appId for joining a voice session.

🌐 Deployment
Frontend → Vercel

Connect GitHub repo

Set build command: npm run build

Output: dist

Backend → Render / Railway

Create new Node service

Add environment variables

Deploy from GitHub or upload zip

Make sure frontend .env or config uses deployed backend URL:
axios.post("https://your-backend-url/chat")

🧪 Future Enhancements

Daily mood journal

Breathing exercise mode

Crisis support resources

AI personality customization

Push notifications for check-ins

🧑‍💻 Contributors

Team Noob – HackFest 2025

❤️ Support

If you like this project, give it a ⭐ on GitHub!
