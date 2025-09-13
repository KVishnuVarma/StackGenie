import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default model;
