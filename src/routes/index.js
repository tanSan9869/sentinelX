import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import ingestionRoutes from "../modules/ingestion/ingestion.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import threatRoutes from "../modules/dashboard/threat.routes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/ingest", ingestionRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/dashboard", threatRoutes);

export default router;
