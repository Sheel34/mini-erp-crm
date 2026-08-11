import "dotenv/config";
import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Mini ERP CRM API",
    version: "1.0.0",
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});