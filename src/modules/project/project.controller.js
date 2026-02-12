import {
  createProjectForUser,
  deleteProject,
  getProjectById,
  regenerateApiKey
} from "./project.service.js";
import Project from "../../database/models/Project.js";

export async function createProjectController(req, res) {
  try {
    const project = await createProjectForUser(req.body.name, req.user.id);
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getProjectsController(req, res) {
  try {
    const projects = await Project.findAll({
      where: { UserId: req.user.id }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getProjectByIdController(req, res) {
  try {
    const project = await getProjectById(req.params.projectId, req.user.id);
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export async function removeProjectController(req, res) {
  try {
    const result = await deleteProject(req.params.projectId, req.user.id);
    console.log({ projectId: req.params.projectId, userId: req.user.id });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export const regenerateKey = async (req, res) => {
  try {
    const project = await regenerateApiKey(
      req.params.projectId,
      req.user.id
    );

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
