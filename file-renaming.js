import dotenv from "dotenv";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({});

async function main() {
  // Array of PDF file paths to analyze
  const pdfFiles = [
    "./assets/bank statement.pdf",
    "./assets/payslip.pdf",
    "./assets/Bank Statement Example Final.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
    "./assets/Dummy-Bank-Statement.pdf",
  ];

  // Upload PDFs to Gemini
  const uploadedFiles = [];
  for (const pdfPath of pdfFiles) {
    const uploadedFile = await ai.files.upload({ file: pdfPath });
    uploadedFiles.push({
      name: pdfPath.split("/").pop(),
      uri: uploadedFile.uri,
      mimeType: uploadedFile.mimeType,
    });
  }

  // Create prompt for analysis
  const prompt = `Analyze these PDF documents and create renaming suggestions.

Template: {Client}_{DocType}_{Issuer}_{Date}.pdf

Extract:
- Client: Company or person the document relates to
- DocType: Type of document (invoice, contract, report, etc.)
- Issuer: Who created the document
- Date: Most relevant date (format: YYYY-MM-DD)

Return JSON array:
[
  {
    "previousName": "original_filename.pdf",
    "newName": "Client_DocType_Issuer_Date.pdf",
    "confidenceScore": 0.85
  }
]

Documents to analyze:`;

  const contentParts = [prompt];
  uploadedFiles.forEach((file) => {
    contentParts.push(`\n--- ${file.name} ---`);
    contentParts.push(createPartFromUri(file.uri, file.mimeType));
  });

  // Send to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [createUserContent(contentParts)],
  });

  // Parse response
  const jsonMatch = response.text.match(/\[[\s\S]*\]/);
  const results = JSON.parse(jsonMatch[0]);

  // Display results
  console.log("\nRenaming Results:");
  results.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.previousName}`);
    console.log(`   -> ${result.newName}`);
    console.log(`   Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`);
  });

  return results;
}

main().catch(console.error);
