import { GoogleGenerativeAI } from '@google/generative-ai';
import envConfig from '../config';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
