import Project from "../../database/models/Project.js";

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  const project = await Project.findOne({ where: { apiKey } });

  if (!project) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  req.project = project;
  next();
};

export default apiKeyMiddleware;
