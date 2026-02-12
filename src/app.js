import express from "express";
import routes from "./routes/index.js";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (_req, res) => {
	res.json({ status: "ok", message: "SentinelX API is running" });
});

export default app;
