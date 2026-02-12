import { Router } from "express";
import {
	createProjectController,
	getProjectsController,
	getProjectByIdController,
	removeProjectController,
	regenerateKey
} from "./project.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createProjectController);
router.get("/", authMiddleware, getProjectsController);
router.get("/:projectId", authMiddleware, getProjectByIdController);
router.delete("/:projectId", authMiddleware, removeProjectController);
router.put("/:projectId/regenerate", authMiddleware, regenerateKey);


export default router;
