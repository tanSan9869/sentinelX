import { saveLog } from "./ingestion.service.js";
import redisClient from "../../config/redis.js";

export const ingestLog = async (req, res) => {
  try {
    const { ip, method, route, statusCode, userAgent } = req.body;

    const log = await saveLog(req.project.id, {
      ip,
      method,
      route,
      statusCode,
      userAgent,
    });

    const blockKey = `block:${req.project.id}:${ip}`;

    const redisBlocked = await redisClient.get(blockKey);

    if (redisBlocked) {
      return res.json({ blocked: true });
    }

    return res.json({ blocked: false, log });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
