import { generateContent } from '../config/ai.js';
import Project from '../models/Project.js';
import { v4 as uuidv4 } from 'uuid';

const systemPrompt = `You are an expert full-stack web application architect. Your task is to:
1. Analyze the user's project requirements
2. Break down the project into components
3. Generate a detailed project structure with components
4. Provide code snippets for key components

Output should be a JSON object matching this schema:
{
    "projectId": string,
    "projectName": string,
    "description": string,
    "components": [
        {
            "type": string (e.g., "frontend", "backend", "database"),
            "props": {
                "name": string,
                "description": string,
                "technology": string,
                "dependencies": string[]
            },
            "code": string (implementation code or schema)
        }
    ]
}

Ensure your response is valid JSON format and matches this schema exactly. Do not wrap the JSON object in a Markdown code block.`;

// === Generate Project ===
export const generateProject = async (req, res) => {
    try {
        const { prompt, userInfo } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        try {
            // Combine system prompt and user prompt
            const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
            
            // Generate content using Gemini
            const responseText = await generateContent(fullPrompt);

            // Clean the raw response by removing Markdown code fences and JSON label
            const cleanedResponse = responseText.trim().replace(/^```json\n|```$/g, '');

            const aiResponse = JSON.parse(cleanedResponse);

            if (!aiResponse.projectName || !aiResponse.components) {
                throw new Error("Invalid response format");
            }

            // Save project to MongoDB
            const project = await Project.create({
                projectId: `proj_${uuidv4().split("-")[0]}`,
                projectName: aiResponse.projectName,
                description: aiResponse.description,
                createdBy: userInfo,
                status: "generated",
                components: aiResponse.components,
            });

            return res.json(project);
        } catch (parseError) {
            console.error("Response parsing error:", parseError);
            return res.status(500).json({
                error: "Failed to parse AI response",
                details: parseError.message
            });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        
        if (error.message.includes('429')) {
            return res.status(429).json({
                error: "Rate limit exceeded",
                details: "Please wait 60 seconds before trying again"
            });
        }

        return res.status(500).json({
            error: "Failed to generate project",
            details: error.message
        });
    }
};