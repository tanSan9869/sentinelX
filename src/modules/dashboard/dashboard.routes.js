import express from "express";
import { getLogs } from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId/logs", authMiddleware, getLogs);

export default router;
