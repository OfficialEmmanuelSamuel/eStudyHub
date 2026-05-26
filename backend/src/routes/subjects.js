const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { firebaseUid } = req.query;
    if (!firebaseUid) {
      return res.status(400).json({ message: "firebaseUid is required." });
    }

    const subjects = await prisma.studentSubject.findMany({
      where: { firebaseUid: String(firebaseUid) },
      orderBy: { createdAt: "desc" },
    });
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch subjects.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firebaseUid, department, category, name } = req.body;

    if (!firebaseUid || !department || !category || !name) {
      return res.status(400).json({ message: "firebaseUid, department, category and name are required." });
    }

    const created = await prisma.studentSubject.upsert({
      where: {
        firebaseUid_name: {
          firebaseUid: String(firebaseUid),
          name: String(name),
        },
      },
      update: {
        department: String(department),
        category: String(category),
      },
      create: {
        firebaseUid: String(firebaseUid),
        department: String(department),
        category: String(category),
        name: String(name),
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: "Failed to save subject.", error: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { firebaseUid, name } = req.body;
    if (!firebaseUid || !name) {
      return res.status(400).json({ message: "firebaseUid and name are required." });
    }

    await prisma.studentSubject.deleteMany({
      where: {
        firebaseUid: String(firebaseUid),
        name: String(name),
      },
    });

    return res.json({ message: "Subject removed." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove subject.", error: error.message });
  }
});

module.exports = router;

