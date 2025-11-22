import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';
import { GEMINI_MODEL, DEFAULT_SYSTEM_INSTRUCTION } from '../constants';

// We initialize this lazily to allow for checking the environment variable
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    // In a real production app, you might want to handle this more gracefully if the key is missing
    const apiKey = process.env.API_KEY || ''; 
    if (!apiKey) {
      console.warn("API_KEY is missing from process.env");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const streamChatResponse = async (
  history: Message[],
  newMessage: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const client = getAIClient();
  
  // Transform internal message format to Gemini chat history format
  // Note: Gemini API expects history to alternate User/Model and start with User if possible,
  // but the SDK manages state in a Chat session. We will recreate the chat state here.
  
  try {
    const chat: Chat = client.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    let fullText = '';
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // If API key is invalid or missing, throw a readable error
    if (error instanceof Error && error.message.includes('API key')) {
        throw new Error("Invalid or missing API Key. Please check your environment configuration.");
    }
    throw error;
  }
};