import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Updated model name to a supported version
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw error;
    }
};

export default model;