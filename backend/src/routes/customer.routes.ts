import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Create customer
router.post("/", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      businessName,
      gstNumber,
      customerType,
      address,
      status,
      followUpDate,
      notes,
    } = req.body;

    if (!name || !mobile || !businessName || !customerType || !address) {
      return res.status(400).json({
        message:
          "name, mobile, businessName, customerType and address are required",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        mobile,
        email,
        businessName,
        gstNumber,
        customerType,
        address,
        status,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        notes,
        createdById: res.locals.user.userId,
      },
    });

    return res.status(201).json({ customer });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create customer",
    });
  }
});

// List/search customers
router.get("/", async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            {
              businessName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            { mobile: { contains: search } },
          ],
        }
      : {};

    const [customers, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return res.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch customers",
    });
  }
});

// Get customer
router.get("/:id", async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        followUps: {
          orderBy: { followUpDate: "desc" },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.json({ customer });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch customer",
    });
  }
});

// Update customer
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      businessName,
      gstNumber,
      customerType,
      address,
      status,
      followUpDate,
      notes,
    } = req.body;

    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        name,
        mobile,
        email,
        businessName,
        gstNumber,
        customerType,
        address,
        status,
        followUpDate:
          followUpDate === null
            ? null
            : followUpDate
              ? new Date(followUpDate)
              : undefined,
        notes,
      },
    });

    return res.json({ customer });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Customer not found",
    });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      message: "Customer not found",
    });
  }
});

// Add follow-up
router.post("/:id/follow-ups", async (req, res) => {
  try {
    const { note, followUpDate } = req.body;

    if (!note || !followUpDate) {
      return res.status(400).json({
        message: "note and followUpDate are required",
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const followUp = await prisma.followUp.create({
      data: {
        customerId: req.params.id,
        createdById: res.locals.user.userId,
        note,
        followUpDate: new Date(followUpDate),
      },
    });

    return res.status(201).json({ followUp });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create follow-up",
    });
  }
});

export default router;