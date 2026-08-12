import "dotenv/config";
import express from "express";

import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";

import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import cors from "cors";
import challanRoutes from "./routes/challan.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174",
      "https://mini-erp-crm-one-zeta.vercel.app"
    ],
  }),
);
app.use(express.json());



app.get("/api", (_req, res) => {
  res.json({
    name: "Mini ERP CRM API",
    version: "1.0.0",
  });
});

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

app.use("/api/auth", authRoutes);

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/challans", challanRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});