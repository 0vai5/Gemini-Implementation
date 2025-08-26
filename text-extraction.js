import dotenv from "dotenv";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  const pdf = await ai.files.upload({
    file: "./assets/image-pdf.pdf",
  });

  const pdfContent = createUserContent([
    "Examine the File and then provide me the exact text from the PDF.",
    createPartFromUri(pdf.uri, pdf.mimeType),
  ]);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [pdfContent],
    config: {
      systemInstruction:
        "You are an expert at extracting text from documents. Your task is to analyze the provided PDF file and return only the exact, complete, and unaltered text content found within the document. Do not summarize, paraphrase, or omit any part of the text. Preserve the original formatting, line breaks, and structure as closely as possible. Exclude any commentary, interpretation, or additional information. If the PDF contains images with embedded text, extract that text as well. If the document is empty or unreadable, state this clearly.    ",
    },
  });
  console.log(response.text);
}

main();
