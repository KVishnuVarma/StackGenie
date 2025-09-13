// src/controllers/projectController.js
import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { projectId, projectName, description, createdBy, status } = req.body;
    const project = await Project.create({
      projectId,
      projectName,
      description,
      createdBy,
      status,
      components: []
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    if (!projects) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.projectName = req.body.projectName || project.projectName;
    project.description = req.body.description || project.description;
    project.status = req.body.status || project.status;
    project.components = req.body.components || project.components;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
