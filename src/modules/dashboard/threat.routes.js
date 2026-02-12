import express from "express";
import { getThreatSummary } from "./threat.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId/threats", authMiddleware, getThreatSummary);

export default router;
