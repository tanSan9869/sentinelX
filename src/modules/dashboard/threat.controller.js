import Project from "../../database/models/Project.js";
import ThreatScore from "../../database/models/ThreatScore.js";
import redisClient from "../../config/redis.js";

const DEFAULT_BLOCK_REASON = "Threat score exceeded threshold";

const getRedisBlocks = async (projectId) => {
  const blocked = [];
  const keys = await redisClient.keys(`block:${projectId}:*`);

  for (const key of keys) {
    const raw = await redisClient.get(key);
    let payload;

    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = null;
    }

    const ttl = await redisClient.ttl(key);
    const [, , ip] = key.split(":");

    blocked.push({
      ip,
      reason: payload?.reason ?? DEFAULT_BLOCK_REASON,
      expiresAt: payload?.expiresAt ?? (ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null)
    });
  }

  return blocked.sort((a, b) => {
    if (!a.expiresAt && !b.expiresAt) return 0;
    if (!a.expiresAt) return 1;
    if (!b.expiresAt) return -1;
    return new Date(b.expiresAt) - new Date(a.expiresAt);
  });
};

export const getThreatSummary = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      where: { id: projectId, UserId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const [threats, blocked] = await Promise.all([
      ThreatScore.findAll({
        where: { ProjectId: projectId },
        order: [["score", "DESC"]]
      }),
      getRedisBlocks(projectId)
    ]);

    res.json({ threats, blocked });
  } catch (error) {
    console.error("Failed to fetch threat summary", error);
    res.status(500).json({ message: "Failed to fetch threat summary" });
  }
};

