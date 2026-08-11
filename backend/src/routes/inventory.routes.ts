import { Router } from "express";
import { prisma } from "../lib/prisma.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create stock movement
router.post(
  "/movements",
  requireRole("ADMIN", "WAREHOUSE"),
  async (req, res) => {
    try {
      const { productId, quantity, type, reason } = req.body;

      const parsedQuantity = Number(quantity);

      if (!productId || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({
          message: "productId and a positive integer quantity are required",
        });
      }

      if (type !== "IN" && type !== "OUT") {
        return res.status(400).json({
          message: "type must be IN or OUT",
        });
      }

      if (!reason) {
        return res.status(400).json({
          message: "reason is required",
        });
      }

      const result = await prisma.$transaction(
        async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        if (type === "OUT" && product.currentStock < parsedQuantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const newStock =
          type === "IN"
            ? product.currentStock + parsedQuantity
            : product.currentStock - parsedQuantity;

        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: {
            currentStock: newStock,
          },
        });

        const movement = await tx.stockMovement.create({
          data: {
            productId,
            quantity: parsedQuantity,
            type,
            reason,
            createdById: res.locals.user.userId,
          },
        });

        return {
          product: updatedProduct,
          movement,
        };
      }, 
        {
            maxWait: 10000,
            timeout: 20000,
        },
    );

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "PRODUCT_NOT_FOUND") {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        if (error.message === "INSUFFICIENT_STOCK") {
          return res.status(400).json({
            message: "Insufficient stock",
          });
        }
      }

      console.error(error);

      return res.status(500).json({
        message: "Unable to create stock movement",
      });
    }
  },
);

// Movement history
router.get("/movements", async (req, res) => {
  try {
    const productId =
      typeof req.query.productId === "string"
        ? req.query.productId
        : undefined;

    const movements = await prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return res.json({
      data: movements,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch stock movements",
    });
  }
});

// Low-stock products
router.get("/low-stock", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        currentStock: "asc",
      },
    });

    const lowStockProducts = products.filter(
      (product) => product.currentStock <= product.minimumStock,
    );

    return res.json({
      data: lowStockProducts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch low-stock products",
    });
  }
});

export default router;