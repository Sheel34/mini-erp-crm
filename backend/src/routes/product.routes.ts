import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      unitPrice,
      minimumStock,
      warehouse,
    } = req.body;

    if (
      !name ||
      !sku ||
      !category ||
      unitPrice === undefined ||
      minimumStock === undefined ||
      !warehouse
    ) {
      return res.status(400).json({
        message:
          "name, sku, category, unitPrice, minimumStock and warehouse are required",
      });
    }

    if (Number(unitPrice) < 0 || Number(minimumStock) < 0) {
      return res.status(400).json({
        message: "unitPrice and minimumStock cannot be negative",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        unitPrice,
        minimumStock: Number(minimumStock),
        warehouse,
        createdById: res.locals.user.userId,
      },
    });

    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);

    return res.status(409).json({
      message: "Unable to create product. SKU may already exist.",
    });
  }
});

// List/search products
router.get("/", async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const products = await prisma.product.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  sku: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      data: products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch products",
    });
  }
});

// Get product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        movements: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({ product });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch product",
    });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      category,
      unitPrice,
      minimumStock,
      warehouse,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        category,
        unitPrice,
        minimumStock:
          minimumStock === undefined ? undefined : Number(minimumStock),
        warehouse,
      },
    });

    return res.json({ product });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Product not found",
    });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { movements: true, challanItems: true },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.currentStock > 0 || product.movements.length > 0 || product.challanItems.length > 0) {
      return res.status(409).json({
        message: "Product cannot be deleted because it has inventory history or transactions",
      });
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to delete product",
    });
  }
});

export default router;