import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "You: ",
  });

  console.log(
    "Welcome to Gemini CLI Chat! Type your questions below. Type 'exit' to quit."
  );
  
  rl.prompt();

  rl.on("line", async (line) => {
    const question = line.trim();
    if (question.toLowerCase() === "exit") {
      rl.close();
      return;
    }
    const stream = await chat.sendMessageStream({ message: question });
    process.stdout.write("Gemini: ");
    for await (const chunk of stream) {
      process.stdout.write(chunk.text);
    }
    process.stdout.write("\n");
    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}

main();
