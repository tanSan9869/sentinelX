import ThreatScore from "../../database/models/ThreatScore.js";
import { RULES, suspiciousRoutes } from "./threat.rules.js";
import redisClient from "../../config/redis.js";


const BLOCK_TTL_SECONDS = 180;
const BLOCK_REASON = "Threat score exceeded threshold";
const BRUTE_FORCE_THRESHOLD = 5;
const BRUTE_FORCE_WINDOW_SECONDS = 120;
const BRUTE_FORCE_REASON = "Repeated failed logins";

export const calculateThreatScore = async (projectId, log) => {
  const { route = "", statusCode, ip } = log;
  let scoreIncrease = 0;

  if (route.toLowerCase().includes("login") && statusCode === 401) {
    if (projectId && ip) {
      const failKey = `login_fail:${projectId}:${ip}`;
      const attempts = await redisClient.incr(failKey);

      if (attempts === 1) {
        await redisClient.expire(failKey, BRUTE_FORCE_WINDOW_SECONDS);
      }

      if (attempts >= BRUTE_FORCE_THRESHOLD) {
        const blockKey = `block:${projectId}:${ip}`;
        const expiresAt = new Date(Date.now() + BLOCK_TTL_SECONDS * 1000).toISOString();

        await redisClient.set(blockKey, JSON.stringify({
          ip,
          reason: BRUTE_FORCE_REASON,
          expiresAt
        }), {
          EX: BLOCK_TTL_SECONDS
        });
      }
    }

    scoreIncrease += RULES.FAILED_LOGIN;
  }

  if (suspiciousRoutes.some((r) => route.includes(r))) {
    scoreIncrease += RULES.SUSPICIOUS_ROUTE;
  }

  if (statusCode >= 400) {
    scoreIncrease += RULES.HIGH_ERROR_RATE;
  }

  return scoreIncrease;
};

export const processThreat = async (projectId, log) => {
  const { ip } = log;

  const blockKey = `block:${projectId}:${ip}`;
  const alreadyBlocked = await redisClient.get(blockKey);

  if (alreadyBlocked) {
    return;
  }

  let threat = await ThreatScore.findOne({
    where: { ip, ProjectId: projectId }
  });

  if (threat && threat.score >= RULES.BLOCK_THRESHOLD) {
    threat.score = 0;
    await threat.save();
  }

  const scoreIncrease = await calculateThreatScore(projectId, log);

  if (scoreIncrease === 0) return;

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

  if (threat.score >= RULES.BLOCK_THRESHOLD) {
    const expiresAt = new Date(Date.now() + BLOCK_TTL_SECONDS * 1000).toISOString();

    await redisClient.set(blockKey, JSON.stringify({
      ip,
      reason: BLOCK_REASON,
      expiresAt
    }), {
      EX: BLOCK_TTL_SECONDS
    });
  }
};

