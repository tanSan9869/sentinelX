import express from "express";
import { ingestLog } from "./ingestion.controller.js";
import apiKeyMiddleware from "./apiKey.middleware.js";

const router = express.Router();

router.post("/", apiKeyMiddleware, ingestLog);

export default router;
