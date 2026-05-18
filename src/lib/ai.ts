import { GoogleGenerativeAI } from '@google/generative-ai';
import envConfig from '../config';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY || '');

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

export const geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

export const generateAIResponse = async (prompt: string) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response');
  }
};
