const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const apiKey = "AQ.Ab8RN6K8W9OOrWEUCl7bI4fsI9kzKd6Y6RTyu3qdqFo6WwzzFw";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const fetchPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
      systemInstruction: "You are a test."
    });

    const result = await fetchPromise;
    fs.writeFileSync("key-error.log", "SUCCESS: " + result.response.text());
  } catch (err) {
    fs.writeFileSync("key-error.log", err.message + "\n" + err.stack);
  }
}

run();
