import ThreatScore from "../database/models/ThreatScore.js";
import { Op } from "sequelize";
import redisClient from "../config/redis.js";
import { RULES } from "../modules/threat/threat.rules.js";

export const cleanupExpiredBlocks = async () => {
  const highThreats = await ThreatScore.findAll({
    where: {
      score: { [Op.gte]: RULES.BLOCK_THRESHOLD }
    }
  });

  for (const threat of highThreats) {
    const blockKey = `block:${threat.ProjectId}:${threat.ip}`;
    const stillBlocked = await redisClient.get(blockKey);

    if (!stillBlocked) {
      await threat.destroy();
    }
  }
};
