const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.post("/subjects", async (req, res) => {
  try {
    const { name, department, description } = req.body;
    if (!name || !department) {
      return res
        .status(400)
        .json({ message: "name and department are required." });
    }

    const subject = await prisma.subject.upsert({
      where: { name: String(name).trim() },
      update: {
        department: String(department).trim(),
        description: description ? String(description).trim() : null,
      },
      create: {
        name: String(name).trim(),
        department: String(department).trim(),
        description: description ? String(description).trim() : null,
      },
    });

    return res.status(201).json(subject);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to save subject.", error: error.message });
  }
});

router.post("/topics", async (req, res) => {
  try {
    const { subjectId, title, description, content, imageUrl } = req.body;
    if (!subjectId || !title) {
      return res
        .status(400)
        .json({ message: "subjectId and title are required." });
    }

    const topic = await prisma.subjectTopic.upsert({
      where: {
        subjectId_title: {
          subjectId: String(subjectId),
          title: String(title).trim(),
        },
      },
      update: {
        description: description ? String(description).trim() : null,
        content: content ? String(content).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
      },
      create: {
        subjectId: String(subjectId),
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        content: content ? String(content).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
      },
    });

    return res.status(201).json(topic);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to save topic.", error: error.message });
  }
});

router.post("/topics/bulk", async (req, res) => {
  try {
    const { subjectId, rows } = req.body;
    if (!subjectId || !Array.isArray(rows) || rows.length === 0) {
      return res
        .status(400)
        .json({ message: "subjectId and non-empty rows are required." });
    }

    const payload = rows
      .filter((row) => row && row.title)
      .map((row) => ({
        subjectId: String(subjectId),
        title: String(row.title).trim(),
        description: row.description ? String(row.description).trim() : null,
        content: row.content ? String(row.content).trim() : null,
        imageUrl: row.imageUrl ? String(row.imageUrl).trim() : null,
      }));

    if (!payload.length) {
      return res
        .status(400)
        .json({ message: "No valid rows with title found." });
    }

    await prisma.subjectTopic.createMany({
      data: payload,
      skipDuplicates: true,
    });

    return res.status(201).json({
      message: "Topics imported successfully.",
      count: payload.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to import topics.", error: error.message });
  }
});

router.post("/quizzes", async (req, res) => {
  try {
    const {
      subjectId,
      topicId,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      answer,
      explanation,
    } = req.body;
    if (
      !subjectId ||
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !answer
    ) {
      return res.status(400).json({
        message:
          "subjectId, question, optionA, optionB, optionC, optionD and answer are required.",
      });
    }

    const quiz = await prisma.subjectQuiz.create({
      data: {
        subjectId: String(subjectId),
        topicId: topicId ? String(topicId) : null,
        question: String(question).trim(),
        optionA: String(optionA).trim(),
        optionB: String(optionB).trim(),
        optionC: String(optionC).trim(),
        optionD: String(optionD).trim(),
        answer: String(answer).trim(),
        explanation: explanation ? String(explanation).trim() : null,
      },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to save quiz.", error: error.message });
  }
});

router.post("/quizzes/bulk", async (req, res) => {
  try {
    const { subjectId, rows } = req.body;
    if (!subjectId || !Array.isArray(rows) || rows.length === 0) {
      return res
        .status(400)
        .json({ message: "subjectId and non-empty rows are required." });
    }

    const payload = rows
      .filter(
        (row) =>
          row &&
          row.question &&
          row.optionA &&
          row.optionB &&
          row.optionC &&
          row.optionD &&
          row.answer,
      )
      .map((row) => ({
        subjectId: String(subjectId),
        topicId: row.topicId ? String(row.topicId) : null,
        question: String(row.question).trim(),
        optionA: String(row.optionA).trim(),
        optionB: String(row.optionB).trim(),
        optionC: String(row.optionC).trim(),
        optionD: String(row.optionD).trim(),
        answer: String(row.answer).trim(),
        explanation: row.explanation ? String(row.explanation).trim() : null,
      }));

    if (!payload.length) {
      return res.status(400).json({ message: "No valid quiz rows found." });
    }

    await prisma.subjectQuiz.createMany({
      data: payload,
    });

    return res.status(201).json({
      message: "Quizzes imported successfully.",
      count: payload.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to import quizzes.", error: error.message });
  }
});

router.delete("/subjects/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    if (!subjectId) {
      return res.status(400).json({ message: "subjectId is required." });
    }

    await prisma.subject.delete({
      where: { id: String(subjectId) },
    });

    return res.status(200).json({ message: "Subject deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete subject.", error: error.message });
  }
});

router.delete("/departments/:department", async (req, res) => {
  try {
    const department = String(req.params.department || "").trim();
    const departmentName = String(req.body.departmentName || "").trim();

    if (!department || !departmentName) {
      return res.status(400).json({ message: "Department name is required." });
    }

    if (department !== departmentName) {
      return res
        .status(400)
        .json({ message: "Department confirmation does not match." });
    }

    const deleted = await prisma.subject.deleteMany({
      where: { department },
    });
    if (deleted.count === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for this department." });
    }

    // Also remove any student-scoped subjects (category entries) tied to this department
    const deletedStudentCategories = await prisma.studentSubject.deleteMany({
      where: { department },
    });

    return res.status(200).json({
      message: "Department deleted successfully.",
      deletedSubjects: deleted.count,
      deletedStudentCategories: deletedStudentCategories.count,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete department.", error: error.message });
  }
});

router.delete("/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    if (!topicId) {
      return res.status(400).json({ message: "topicId is required." });
    }

    await prisma.subjectTopic.delete({
      where: { id: String(topicId) },
    });

    return res.status(200).json({ message: "Topic deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete topic.", error: error.message });
  }
});

router.delete("/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!quizId) {
      return res.status(400).json({ message: "quizId is required." });
    }

    await prisma.subjectQuiz.delete({
      where: { id: String(quizId) },
    });

    return res.status(200).json({ message: "Quiz deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete quiz.", error: error.message });
  }
});

router.delete("/topics/:topicId/content", async (req, res) => {
  try {
    const { topicId } = req.params;
    if (!topicId) {
      return res.status(400).json({ message: "topicId is required." });
    }

    await prisma.subjectTopic.update({
      where: { id: String(topicId) },
      data: {
        content: null,
        imageUrl: null,
      },
    });

    return res
      .status(200)
      .json({ message: "Topic content removed successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove topic content.",
      error: error.message,
    });
  }
});

module.exports = router;
