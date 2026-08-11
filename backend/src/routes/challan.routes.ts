import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function getParamId(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

// Create a draft challan
router.post("/", requireRole("ADMIN", "SALES"), async (req, res) => {
  try {
    const { customerId, items } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "customerId and at least one item are required",
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const productIds = items.map((item) => item.productId);

    if (
      items.some(
        (item) =>
          !item.productId ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0,
      )
    ) {
      return res.status(400).json({
        message: "Every item must have a valid productId and positive quantity",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== new Set(productIds).size) {
      return res.status(400).json({
        message: "One or more products do not exist",
      });
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const challanNumber = `CH-${Date.now()}`;

    const challan = await prisma.salesChallan.create({
      data: {
        challanNumber,
        customerId,
        createdById: res.locals.user.userId,
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;

            return {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              unitPrice: product.unitPrice,
              quantity: Number(item.quantity),
            };
          }),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(201).json({
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create sales challan",
    });
  }
});

// List challans
router.get("/", async (_req, res) => {
  try {
    const challans = await prisma.salesChallan.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            businessName: true,
            mobile: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      data: challans,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch challans",
    });
  }
});

// Get one challan
router.get("/:id", async (req, res) => {
  try {
    const challan = await prisma.salesChallan.findUnique({
      where: {
        id: getParamId(req.params.id),
      },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!challan) {
      return res.status(404).json({
        message: "Sales challan not found",
      });
    }

    return res.json({
      challan,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch sales challan",
    });
  }
});

// Confirm challan and reduce stock atomically
router.post(
  "/:id/confirm",
  requireRole("ADMIN", "SALES", "WAREHOUSE"),
  async (req, res) => {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const challan = await tx.salesChallan.findUnique({
            where: {
                id: getParamId(req.params.id),
            },
            include: {
                items: true,
            },
            });

          if (!challan) {
            throw new Error("CHALLAN_NOT_FOUND");
          }

          if (challan.status !== "DRAFT") {
            throw new Error("CHALLAN_NOT_DRAFT");
          }

          if (challan.items.length === 0) {
            throw new Error("CHALLAN_EMPTY");
          }

          for (const item of challan.items) {
            const updated = await tx.product.updateMany({
              where: {
                id: item.productId,
                currentStock: {
                  gte: item.quantity,
                },
              },
              data: {
                currentStock: {
                  decrement: item.quantity,
                },
              },
            });

            if (updated.count !== 1) {
              throw new Error(
                `INSUFFICIENT_STOCK:${item.productId}:${item.quantity}`,
              );
            }

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                quantity: item.quantity,
                type: "OUT",
                reason: `Sales challan ${challan.challanNumber}`,
                createdById: res.locals.user.userId,
              },
            });
          }

          const confirmed = await tx.salesChallan.update({
            where: {
              id: challan.id,
            },
            data: {
              status: "CONFIRMED",
            },
            include: {
              customer: true,
              items: true,
            },
          });

          return confirmed;
        },
        {
          maxWait: 10000,
          timeout: 20000,
        },
      );

      return res.json({
        message: "Sales challan confirmed successfully",
        challan: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "CHALLAN_NOT_FOUND") {
          return res.status(404).json({
            message: "Sales challan not found",
          });
        }

        if (error.message === "CHALLAN_NOT_DRAFT") {
          return res.status(409).json({
            message: "Only draft challans can be confirmed",
          });
        }

        if (error.message === "CHALLAN_EMPTY") {
          return res.status(400).json({
            message: "Cannot confirm an empty challan",
          });
        }

        if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
          return res.status(400).json({
            message: "Insufficient stock for one or more products",
          });
        }
      }

      console.error(error);

      return res.status(500).json({
        message: "Unable to confirm sales challan",
      });
    }
  },
);

// Cancel draft challan
router.post(
  "/:id/cancel",
  requireRole("ADMIN", "SALES"),
  async (req, res) => {
    try {
      const challan = await prisma.salesChallan.findUnique({
        where: {
          id: getParamId(req.params.id),
        },
      });

      if (!challan) {
        return res.status(404).json({
          message: "Sales challan not found",
        });
      }

      if (challan.status !== "DRAFT") {
        return res.status(409).json({
          message: "Only draft challans can be cancelled",
        });
      }

      const cancelled = await prisma.salesChallan.update({
        where: {
          id: challan.id,
        },
        data: {
          status: "CANCELLED",
        },
        include: {
          customer: true,
          items: true,
        },
      });

      return res.json({
        message: "Sales challan cancelled",
        challan: cancelled,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to cancel sales challan",
      });
    }
  },
);

export default router;