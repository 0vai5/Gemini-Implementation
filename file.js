import dotenv from "dotenv";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {

    // Image Based Recognition

  //   const image = await ai.files.upload({
  //     file: "./assets/car.jpg",
  //   });

  //   const imageContent = createUserContent([
  //     "Examine the Image, Provide relevant information like the color, is it attractive and relevant links to similar images",
  //     createPartFromUri(image.uri, image.mimeType),
  //   ]);


  // Normal Basic PDF

  const pdf = await ai.files.upload({
    file: "./assets/image-pdf.pdf",
  });

  const pdfContent = createUserContent([
    "Examine the File and then provide me the detailed Summary in a markdown format with also the citations in order to be able to access it later. Make sure to use Bullet points for better readability. Make sure to maintain the attention span for young readers, who are using this tool in order to optimize there time management, and to be fast at grasping information from documents make it brief but descriptive. Do it for page 1-3 only.",
    createPartFromUri(pdf.uri, pdf.mimeType),
  ]);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [pdfContent],
    config: {
        systemInstruction: "You are a mature, 10 years of experience in teaching Dividend Policy and Capacity. Act as a teaching assistant and a mature Human."
    }
  });
  console.log(response.text);
}

main();
