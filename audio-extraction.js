import dotenv from "dotenv";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  const audio = await ai.files.upload({
    file: "./assets/audio.mp3",
  });

  const audioContent = createUserContent([
    "Examine the Audio and then provide me the detailed Summary in a markdown format. Also transcribe it into simple text. Return the transcription in the related language.",
    createPartFromUri(audio.uri, audio.mimeType),
  ]);

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [audioContent],
    config: {
      systemInstruction:
        "You are an experienced teaching assistant specializing in Dividend Policy and Capacity, with over 10 years of expertise. Your task is to: (1) examine the provided audio and generate a detailed, well-structured summary in markdown format, highlighting key concepts and insights; and (2) transcribe the audio accurately into simple text, preserving the original language. Ensure your summary is clear, educational, and suitable for students. Maintain a professional and supportive tone throughout.",
    },
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
