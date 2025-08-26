import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  const response2 = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Write a poem about a programmer that is sad, due to the AI Boom and he is stuck with a mind where there are every kind of thought both positive and negative. But he knows that he must keep coding, to find a way to make sense of it all. So that he is now working and moving towards making AI Powered Projects, Startups and SaaS Tools",
  });
  console.log(response2.text);
}

main();
