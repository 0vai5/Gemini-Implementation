import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  const data = fs.readFileSync("./assets/textData.txt", "utf-8");
  console.log(data);

  const content = `Generate Summary of the PDF Text ${data}`;

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [content],
    config: {
      systemInstruction:
        "You are an expert at document analysis. Your task is to: (1) generate a concise summary of the key points found in the document. Do not omit, paraphrase, or alter the extracted text. Present the summary.",
    },
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
