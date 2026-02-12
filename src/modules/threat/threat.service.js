import ThreatScore from "../../database/models/ThreatScore.js";
import BlockedIP from "../../database/models/BlockedIP.js";
import { calculateThreatScore } from "./threat.engine.js";
import { RULES } from "./threat.rules.js";

export const processThreat = async (projectId, log) => {
  const { ip } = log;

  const scoreIncrease = calculateThreatScore(log);

  if (scoreIncrease === 0) return;

  let threat = await ThreatScore.findOne({
    where: { ip, ProjectId: projectId }
  });

  if (!threat) {
    threat = await ThreatScore.create({
      ip,
      score: scoreIncrease,
      ProjectId: projectId
    });
  } else {
    threat.score += scoreIncrease;
    await threat.save();
  }

  // Auto block if threshold exceeded
  if (threat.score >= RULES.BLOCK_THRESHOLD) {
    const alreadyBlocked = await BlockedIP.findOne({
      where: { ip, ProjectId: projectId }
    });

    if (!alreadyBlocked) {
      await BlockedIP.create({
        ip,
        reason: "Threat score exceeded threshold",
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
        ProjectId: projectId
      });
    }
  }
};
