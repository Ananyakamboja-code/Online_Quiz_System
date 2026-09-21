import prisma from '../prismaClient.js';

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/faculty/dashboard/stats
 * Returns counts + recent data for the logged-in faculty's dashboard.
 */
export async function getDashboardStats(req, res, next) {
  try {
    const facultyId = req.user.id;

    const [totalQuizzes, activeQuizzes, totalQuestions, totalAttempts] =
      await Promise.all([
        prisma.quiz.count({ where: { facultyId } }),
        prisma.quiz.count({ where: { facultyId, status: 'Active' } }),
        prisma.question.count({
          where: { quiz: { facultyId } },
        }),
        prisma.studentResult.count({
          where: { quiz: { facultyId } },
        }),
      ]);

    // Recent 5 quizzes
    const recentQuizzes = await prisma.quiz.findMany({
      where: { facultyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true, title: true, status: true,
        numberOfQuestions: true, createdAt: true,
      },
    });

    // Recent 5 results
    const recentResults = await prisma.studentResult.findMany({
      where: { quiz: { facultyId } },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      include: {
        student: { select: { id: true, name: true, email: true } },
        quiz: { select: { id: true, title: true } },
      },
    });

    // Subject-wise (per quiz) pass/fail stats
    const quizzes = await prisma.quiz.findMany({
      where: { facultyId },
      select: {
        id: true, title: true,
        results: { select: { score: true, totalQuestions: true } },
      },
    });

    const subjectStats = quizzes.map((q) => {
      const students = q.results.length;
      const pass = q.results.filter(
        (r) => (r.score / r.totalQuestions) * 100 >= 60
      ).length;
      const fail = students - pass;
      const avgScore = students
        ? Math.round(
            q.results.reduce(
              (sum, r) => sum + (r.score / r.totalQuestions) * 100,
              0
            ) / students
          )
        : 0;
      return { quizId: q.id, subject: q.title, students, pass, fail, avgScore };
    });

    return res.json({
      totalQuizzes,
      activeQuizzes,
      totalQuestions,
      totalAttempts,
      recentQuizzes,
      recentResults,
      subjectStats,
    });
  } catch (err) {
    next(err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  QUIZ CRUD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/faculty/quizzes
 * Body: { title, description, duration, numberOfQuestions, startDate, endDate, status }
 */
export async function createQuiz(req, res, next) {
  try {
    const facultyId = req.user.id;
    const { title, description, duration, numberOfQuestions, startDate, endDate, status } = req.body;

    if (!title || !description || !duration || !numberOfQuestions || !startDate || !endDate) {
      return res.status(400).json({ message: 'All quiz fields are required.' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        duration: Number(duration),
        numberOfQuestions: Number(numberOfQuestions),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'Draft',
        facultyId,
      },
    });

    return res.status(201).json({ quiz });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/faculty/quizzes
 * Returns all quizzes created by the logged-in faculty.
 */
export async function getMyQuizzes(req, res, next) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { facultyId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true, results: true } } },
    });

    return res.json({ quizzes });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/faculty/quizzes/:id
 */
export async function getQuizById(req, res, next) {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id), facultyId: req.user.id },
      include: {
        questions: true,
        _count: { select: { results: true } },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    return res.json({ quiz });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/faculty/quizzes/:id
 * Body: any subset of { title, description, duration, numberOfQuestions, startDate, endDate, status }
 */
export async function updateQuiz(req, res, next) {
  try {
    const existing = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id), facultyId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const { title, description, duration, numberOfQuestions, startDate, endDate, status } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id: existing.id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(numberOfQuestions !== undefined && { numberOfQuestions: Number(numberOfQuestions) }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(status !== undefined && { status }),
      },
    });

    return res.json({ quiz });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/faculty/quizzes/:id
 * Cascades to questions and results.
 */
export async function deleteQuiz(req, res, next) {
  try {
    const existing = await prisma.quiz.findFirst({
      where: { id: Number(req.params.id), facultyId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Delete results first (no onDelete cascade for results in SQLite workaround)
    await prisma.studentResult.deleteMany({ where: { quizId: existing.id } });
    await prisma.quiz.delete({ where: { id: existing.id } });

    return res.json({ message: 'Quiz deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  QUESTION CRUD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/faculty/quizzes/:quizId/questions
 * Body: { question, optionA, optionB, optionC, optionD, correctAnswer }
 */
export async function addQuestion(req, res, next) {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { id: Number(req.params.quizId), facultyId: req.user.id },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    if (!question || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ message: 'All question fields are required.' });
    }

    if (!['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
      return res.status(400).json({ message: 'Correct answer must be A, B, C, or D.' });
    }

    const newQuestion = await prisma.question.create({
      data: {
        quizId: quiz.id,
        question: question.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctAnswer: correctAnswer.toUpperCase(),
      },
    });

    return res.status(201).json({ question: newQuestion });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/faculty/quizzes/:quizId/questions
 */
export async function getQuestions(req, res, next) {
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { id: Number(req.params.quizId), facultyId: req.user.id },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const questions = await prisma.question.findMany({
      where: { quizId: quiz.id },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ questions });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/faculty/questions/:id
 * Body: any subset of { question, optionA, optionB, optionC, optionD, correctAnswer }
 */
export async function updateQuestion(req, res, next) {
  try {
    const existing = await prisma.question.findUnique({
      where: { id: Number(req.params.id) },
      include: { quiz: { select: { facultyId: true } } },
    });

    if (!existing || existing.quiz.facultyId !== req.user.id) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    if (correctAnswer && !['A', 'B', 'C', 'D'].includes(correctAnswer.toUpperCase())) {
      return res.status(400).json({ message: 'Correct answer must be A, B, C, or D.' });
    }

    const updated = await prisma.question.update({
      where: { id: existing.id },
      data: {
        ...(question !== undefined && { question: question.trim() }),
        ...(optionA !== undefined && { optionA: optionA.trim() }),
        ...(optionB !== undefined && { optionB: optionB.trim() }),
        ...(optionC !== undefined && { optionC: optionC.trim() }),
        ...(optionD !== undefined && { optionD: optionD.trim() }),
        ...(correctAnswer !== undefined && { correctAnswer: correctAnswer.toUpperCase() }),
      },
    });

    return res.json({ question: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/faculty/questions/:id
 */
export async function deleteQuestion(req, res, next) {
  try {
    const existing = await prisma.question.findUnique({
      where: { id: Number(req.params.id) },
      include: { quiz: { select: { facultyId: true } } },
    });

    if (!existing || existing.quiz.facultyId !== req.user.id) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    await prisma.question.delete({ where: { id: existing.id } });

    return res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STUDENT RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/faculty/results
 * Query params: ?quizId=X  (optional filter)
 * Returns all student results for the logged-in faculty's quizzes.
 */
export async function getStudentResults(req, res, next) {
  try {
    const facultyId = req.user.id;
    const quizId = req.query.quizId ? Number(req.query.quizId) : undefined;

    const where = {
      quiz: { facultyId },
      ...(quizId && { quizId }),
    };

    const results = await prisma.studentResult.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        student: { select: { id: true, name: true, email: true } },
        quiz: { select: { id: true, title: true } },
      },
    });

    // Summary stats
    const percentages = results.map((r) => (r.score / r.totalQuestions) * 100);
    const totalAttempts = results.length;
    const avgScore = totalAttempts
      ? Math.round(percentages.reduce((a, b) => a + b, 0) / totalAttempts)
      : 0;
    const highestScore = totalAttempts ? Math.round(Math.max(...percentages)) : 0;
    const lowestScore = totalAttempts ? Math.round(Math.min(...percentages)) : 0;

    return res.json({
      results,
      summary: { totalAttempts, avgScore, highestScore, lowestScore },
    });
  } catch (err) {
    next(err);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FACULTY PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/faculty/profile
 */
export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        phone: true, department: true, employeeId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ profile: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/faculty/profile
 * Body: { name, phone, department }  (email & employeeId are read-only)
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, department } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name.trim(),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(department !== undefined && { department: department.trim() }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        phone: true, department: true, employeeId: true,
        createdAt: true,
      },
    });

    return res.json({ profile: updated });
  } catch (err) {
    next(err);
  }
}
