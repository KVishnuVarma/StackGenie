import Project from "../models/Project.js";
import { v4 as uuidv4 } from 'uuid';

export const createProject = async (req, res) => {
  try {
    const { projectName, description, createdBy } = req.body;
    const project = await Project.create({
      projectId: `proj_${uuidv4().substring(0, 8)}`, // Use UUID for public ID
      projectName,
      description,
      createdBy,
      status: 'draft',
      components: []
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
};

// New function for the builder's save button
export const saveProject = async (req, res) => {
  try {
    const { components } = req.body;
    const updatedProject = await Project.findOneAndUpdate(
      { projectId: req.params.projectId },
      { components, status: 'saved' },
      { new: true } // Returns the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project', details: err.message });
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
    res.status(500).json({ error: 'Failed to retrieve projects', details: err.message });
  }
};

export const getProjectByPublicId = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project', details: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const result = await Project.deleteOne({ projectId: req.params.projectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
};