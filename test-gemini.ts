import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
const envPath = path.resolve('.env.local');
let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("NO API KEY FOUND");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  try {
    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are a test." }],
      },
      history: [],
    });
    console.log("Chat started...");
    const result = await chat.sendMessage("hello");
    console.log("Success:", result.response.text());
  } catch (err: any) {
    console.error("ERROR IN CHAT:", err.message);
  }

  try {
    const fetchPromise = model.generateContent({
      contents: [
        { role: "user", parts: [{ text: "test" }] }
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: "test prompt" }]
      },
    });
    const result2 = await fetchPromise;
    console.log("generateContent Success:", result2.response.text());
  } catch (err: any) {
    console.error("ERROR IN COMPOSE:", err.message);
  }
}

run();
