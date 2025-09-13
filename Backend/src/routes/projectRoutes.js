// src/routes/projectRoutes.js
import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController.js";
import { generateProject } from "../controllers/aiController.js";
import aiLimiter from "../middlewares/aiRateLimiter.js";

const router = express.Router();

router.post("/", createProject);
router.post("/generate", aiLimiter, generateProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
