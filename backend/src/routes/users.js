const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.post("/sync", async (req, res) => {
  try {
    const { firebaseUid, email, fullName, photoUrl } = req.body;

    if (!firebaseUid || !email) {
      return res
        .status(400)
        .json({ message: "firebaseUid and email are required." });
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: String(firebaseUid).trim() },
      update: {
        email: String(email).trim().toLowerCase(),
        fullName: fullName ? String(fullName).trim() : null,
        photoUrl: photoUrl ? String(photoUrl).trim() : null,
        isActive: true,
      },
      create: {
        firebaseUid: String(firebaseUid).trim(),
        email: String(email).trim().toLowerCase(),
        fullName: fullName ? String(fullName).trim() : null,
        photoUrl: photoUrl ? String(photoUrl).trim() : null,
      },
    });

    return res.status(201).json({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      fullName: user.fullName,
      xpPoints: user.xpPoints,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to sync user.", error: error.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(0, Number(req.query.page || 0));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 20)));

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firebaseUid: true,
          fullName: true,
          email: true,
          xpPoints: true,
        },
        orderBy: [{ xpPoints: "desc" }, { createdAt: "asc" }],
        skip: page * pageSize,
        take: pageSize,
      }),
    ]);

    return res.json({ total, page, pageSize, users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch leaderboard.", error: error.message });
  }
});

router.get("/overview", async (req, res) => {
  try {
    const firebaseUid = String(req.query.firebaseUid || "").trim();
    if (!firebaseUid) {
      return res.status(400).json({ message: "firebaseUid is required." });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        xpPoints: true,
        level: true,
        streakDays: true,
      },
    });

    if (!user) {
      return res.json({
        continueLearning: null,
        stats: {
          quizzesTaken: 0,
          avgScore: 0,
          topicsDone: 0,
          pendingTasks: 0,
          aiAsked: 0,
          xpPoints: 0,
          level: 1,
          streakDays: 0,
        },
      });
    }

    const userId = user.id;
    const safe = async (fn) => {
      try {
        return await fn();
      } catch {
        return 0;
      }
    };

    const [
      quizzesTaken,
      avgScoreAgg,
      pendingTasks,
      latestSubject,
      topicsDone,
      aiAsked,
    ] = await Promise.all([
      safe(() =>
        prisma.quizAttempt.count({
          where: { userId, status: "COMPLETED" },
        }),
      ),
      safe(() =>
        prisma.quizAttempt.aggregate({
          _avg: { score: true },
          where: { userId, status: "COMPLETED" },
        }),
      ),
      safe(() =>
        prisma.studyPlannerTask.count({
          where: { userId, isCompleted: false },
        }),
      ),
      safe(() =>
        prisma.studentSubject.findFirst({
          where: { firebaseUid },
          orderBy: { createdAt: "desc" },
          select: { name: true },
        }),
      ),
      safe(() =>
        prisma.progressRecord.count({
          where: { userId, completionRate: { gte: 100 } },
        }),
      ),
      safe(() =>
        prisma.communityMessage.count({
          where: { userId },
        }),
      ),
    ]);

    const avgScore =
      typeof avgScoreAgg === "object" && avgScoreAgg?._avg?.score
        ? Number(avgScoreAgg._avg.score)
        : 0;

    return res.json({
      continueLearning: latestSubject?.name || null,
      stats: {
        quizzesTaken: Number(quizzesTaken) || 0,
        avgScore: Math.round(avgScore),
        topicsDone: Number(topicsDone) || 0,
        pendingTasks: Number(pendingTasks) || 0,
        aiAsked: Number(aiAsked) || 0,
        xpPoints: Number(user.xpPoints) || 0,
        level: Number(user.level) || 1,
        streakDays: Number(user.streakDays) || 0,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch overview.", error: error.message });
  }
});

module.exports = router;
