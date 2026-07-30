import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import activitiesRouter from "./routes/activities.js";
import entriesRouter from "./routes/entries.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/activities", activitiesRouter);
app.use("/api/entries", entriesRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Tracker Backend listening on http://localhost:${PORT}`);
});
