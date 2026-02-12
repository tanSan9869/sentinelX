import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

if (!process.env.REDIS_URL) {
  console.warn("REDIS_URL is not set. Falling back to redis://127.0.0.1:6379");
}

const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (err) =>
  console.error("Redis Error", err)
);

await redisClient.connect();
console.log(`Redis Connected (${redisUrl})`);

export default redisClient;
