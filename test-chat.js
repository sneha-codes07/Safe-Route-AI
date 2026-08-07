const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const apiKey = "AQ.Ab8RN6K8W9OOrWEUCl7bI4fsI9kzKd6Y6RTyu3qdqFo6WwzzFw";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are SafeRoute AI's conversational assistant." }]
      },
      history: [],
      generationConfig: {
        temperature: 0.4,
      },
    });

    const result = await chat.sendMessage(`
[CONTEXT START]
Origin: test
[CONTEXT END]

Question: hello`);
    fs.writeFileSync("chat-error.log", "SUCCESS: " + result.response.text());
  } catch (err) {
    fs.writeFileSync("chat-error.log", err.message + "\n" + err.stack);
  }
}

run();
