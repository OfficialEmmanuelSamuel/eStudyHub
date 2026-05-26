const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/subjects", async (_req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { topics: true, quizzes: true } },
      },
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subjects.", error: error.message });
  }
});

router.get("/subjects/:subjectId/topics", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const topics = await prisma.subjectTopic.findMany({
      where: { subjectId },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        imageUrl: true,
        _count: { select: { quizzes: true } },
      },
    });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topics.", error: error.message });
  }
});

router.get("/subjects/:subjectId/quizzes", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const quizzes = await prisma.subjectQuiz.findMany({
      where: { subjectId },
      orderBy: { createdAt: "desc" },
      include: {
        topic: {
          select: { id: true, title: true },
        },
      },
      take: 100,
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes.", error: error.message });
  }
});

router.get("/summary", async (_req, res) => {
  try {
    const [subjectsCount, topicsCount, quizzesCount] = await Promise.all([
      prisma.subject.count(),
      prisma.subjectTopic.count(),
      prisma.subjectQuiz.count(),
    ]);

    res.json({
      subjects: subjectsCount,
      topics: topicsCount,
      quizzes: quizzesCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch database summary.", error: error.message });
  }
});

module.exports = router;
