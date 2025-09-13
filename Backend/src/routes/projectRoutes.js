import express from "express";
import { 
    createProject, 
    getProjects, 
    getProjectByPublicId, 
    saveProject, 
    deleteProject 
} from "../controllers/projectController.js";
import { generateProject } from "../controllers/aiController.js";
import aiLimiter from "../middlewares/aiRateLimiter.js";

const router = express.Router();

// General project management routes
router.post("/", createProject);
router.get("/", getProjects);

// Builder-specific routes
router.post("/generate", aiLimiter, generateProject);
router.get("/:projectId", getProjectByPublicId); // Use projectId from the URL
router.put("/:projectId/save", saveProject); // Dedicated save route
router.delete("/:projectId", deleteProject);

export default router;