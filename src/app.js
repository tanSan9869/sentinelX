import express from "express";
import routes from "./routes/index.js";
import cors from "cors";


const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://sentinelx-web.vercel.app/"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/api", routes);

app.get("/", (_req, res) => {
	res.json({ status: "ok", message: "SentinelX API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SentinelX backend running",
    timestamp: new Date()
  });
});

export default app;
