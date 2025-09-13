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

// === Convert Code to React ===
export const convertCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code snippet is required' });
        }

        // Construct the prompt for code conversion
        const conversionPrompt = `Convert the following ${language || 'HTML/CSS'} code to a modern React component.
        Requirements:
        1. Use modern React best practices
        2. Include all necessary imports
        3. Use functional components with hooks if needed
        4. Add TypeScript types/interfaces if appropriate
        5. Maintain the same styling and functionality
        6. Ensure the component is reusable
        7. Add proper props interface/type if needed
        8. Use proper naming conventions
        9. Add brief comments explaining complex logic

        Original Code:
        ${code}

        Provide only the converted React code without any explanations.`;

        // Generate content using AI
        const convertedCode = await generateContent(conversionPrompt);

        // Clean the response
        const cleanedCode = convertedCode.replace(/^```(jsx|tsx)?\n|```$/g, '').trim();

        return res.json({
            success: true,
            data: {
                convertedCode: cleanedCode,
                language: 'jsx'
            }
        });

    } catch (error) {
        console.error('Error converting code:', error);
        
        if (error.message.includes('429')) {
            return res.status(429).json({
                error: "Rate limit exceeded",
                details: "Please wait before trying again"
            });
        }

        return res.status(500).json({
            error: "Failed to convert code",
            details: error.message
        });
    }
};

// === Upload and Process Code Files ===
export const processCodeFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;
        
        // Verify file extension
        const fileName = req.file.originalname.toLowerCase();
        const allowedExtensions = ['.html', '.css', '.js', '.jsx', '.tsx'];
        
        if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
            return res.status(400).json({ 
                error: 'Invalid file type. Only HTML, CSS, JavaScript, JSX, and TSX files are allowed.' 
            });
        }

        // Convert buffer to string
        const code = fileBuffer.toString('utf-8');

        // Process the code
        return await convertCode({ body: { code } }, res);

    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({
            error: "Failed to process file",
            details: error.message
        });
    }
};