const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const apiKey = "AQ.Ab8RN6K8W9OOrWEUCl7bI4fsI9kzKd6Y6RTyu3qdqFo6WwzzFw";

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    fs.writeFileSync("models.json", JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync("models.json", "ERROR: " + err.message);
  }
}

listModels();
