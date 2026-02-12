import { v4 as uuidv4 } from "uuid";
import Project from "../../database/models/Project.js";

export async function createProjectForUser(name, userId) {
  const apiKey = `sk_${uuidv4()}`;

  return await Project.create({
    name,
    apiKey,
    UserId: userId,
  });
}

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findOne({
    where: { id: projectId, UserId: userId },
  });

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  await project.destroy();

  return { message: "Project deleted successfully" };
};

export async function getProjectById(projectId, userId) {
  const project = await Project.findOne({
    where: { id: projectId, UserId: userId },
  });

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  return project;
}

export const regenerateApiKey = async (projectId, userId) => {
  const project = await Project.findOne({
    where: { id: projectId, UserId: userId },
  });

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const newKey = "sk_live_" + uuidv4();

  project.apiKey = newKey;
  await project.save();
  await project.reload();

  return project;
};
