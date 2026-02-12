import RequestLog from "../../database/models/RequestLog.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await RequestLog.findAll({
      where: { ProjectId: req.params.projectId },
      order: [["createdAt", "DESC"]],
      limit: 100
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
