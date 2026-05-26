const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { requireAdminAuth } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email, and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists with this email." });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const admin = await prisma.adminUser.create({
      data: {
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        passwordHash,
      },
    });

    return res.status(201).json({ id: admin.id, fullName: admin.fullName, email: admin.email });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register admin.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const admin = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const isValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || "dev_admin_secret";
    const token = jwt.sign(
      { adminId: admin.id, fullName: admin.fullName, email: admin.email, role: "admin" },
      secret,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: "admin" },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login admin.", error: error.message });
  }
});

router.get("/me", requireAdminAuth, async (req, res) => {
  return res.json({ admin: req.admin });
});

module.exports = router;

