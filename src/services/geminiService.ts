import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendMessage(
  content: string,
  history: Message[],
  systemInstruction: string,
  onChunk?: (chunk: string) => void
) {
  const model = "gemini-3-flash-preview";
  
  // Format history for Gemini SDK
  const contents = history.map(msg => ({
    role: msg.role === Role.USER ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  // Add the current user message
  contents.push({
    role: "user",
    parts: [{ text: content }]
  });

  const streamResponse = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  let fullResponse = "";
  for await (const chunk of streamResponse) {
    const text = chunk.text;
    if (text) {
      fullResponse += text;
      onChunk?.(text);
    }
  }

  return fullResponse;
}
