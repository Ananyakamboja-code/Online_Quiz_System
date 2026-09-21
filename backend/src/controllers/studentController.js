import prisma from '../prismaClient.js';

/**
 * Student module controller.
 *
 * All handlers assume requireAuth + requireRole('STUDENT') have run, so
 * req.user = { id, role } is a valid student.
 *
 * Security note: correct answers are NEVER sent to the client. Scoring is done
 * server-side in submitQuiz by comparing against the stored correctAnswer.
 */

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

/** Shape a quiz for list/detail responses (adds questionCount, hides internals). */
function toQuizSummary(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    duration: quiz.duration,
    createdAt: quiz.createdAt,
    questionCount: quiz._count ? quiz._count.questions : undefined,
  };
}

/** Shape a question WITHOUT the correct answer (safe for students). */
function toSafeQuestion(q) {
  return {
    id: q.id,
    quizId: q.quizId,
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
  };
}

/** Shape a result row for history/detail, enriched with quiz title + percentage. */
function toResult(result) {
  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;
  return {
    id: result.id,
    quizId: result.quizId,
    quizTitle: result.quiz ? result.quiz.title : undefined,
    score: result.score,
    totalQuestions: result.totalQuestions,
    correct: result.score,
    incorrect: result.totalQuestions - result.score,
    percentage,
    submittedAt: result.submittedAt,
  };
}

/**
 * GET /api/student/quizzes
 * List all available quizzes with a question count.
 */
export async function listQuizzes(_req, res, next) {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true } } },
    });
    return res.json({ quizzes: quizzes.map(toQuizSummary) });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/student/quizzes/:id
 * Quiz details (title, description, duration, question count). No questions.
 */
export async function getQuiz(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid quiz id.' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    return res.json({ quiz: toQuizSummary(quiz) });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/student/quizzes/:id/questions
 * The quiz's questions WITHOUT correct answers (used while taking the quiz).
 */
export async function getQuizQuestions(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid quiz id.' });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const questions = await prisma.question.findMany({
      where: { quizId: id },
      orderBy: { id: 'asc' },
    });
    return res.json({ questions: questions.map(toSafeQuestion) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/student/quizzes/:id/submit
 * Body: { answers: { [questionId]: "A" | "B" | "C" | "D" } }
 * Scores the attempt server-side, stores a Result, and returns the result
 * with a per-question breakdown.
 */
export async function submitQuiz(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid quiz id.' });
    }

    const answers = req.body.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: 'answers must be an object of questionId -> option.' });
    }

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const questions = await prisma.question.findMany({
      where: { quizId: id },
      orderBy: { id: 'asc' },
    });
    if (questions.length === 0) {
      return res.status(400).json({ message: 'This quiz has no questions.' });
    }

    // Score server-side against stored correct answers.
    let score = 0;
    const breakdown = questions.map((q) => {
      const rawSelected = answers[q.id] ?? answers[String(q.id)] ?? null;
      const selected =
        typeof rawSelected === 'string' &&
        OPTION_KEYS.includes(rawSelected.toUpperCase())
          ? rawSelected.toUpperCase()
          : null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selected,
        correct: q.correctAnswer,
        isCorrect,
      };
    });

    const totalQuestions = questions.length;
    const answeredCount = breakdown.filter((b) => b.selected !== null).length;

    const result = await prisma.result.create({
      data: {
        quizId: id,
        studentId: req.user.id,
        score,
        totalQuestions,
      },
      include: { quiz: true },
    });

    return res.status(201).json({
      result: {
        ...toResult(result),
        unanswered: totalQuestions - answeredCount,
        breakdown,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/student/results
 * The current student's past attempts, newest first.
 */
export async function listResults(req, res, next) {
  try {
    const results = await prisma.result.findMany({
      where: { studentId: req.user.id },
      orderBy: { submittedAt: 'desc' },
      include: { quiz: true },
    });
    return res.json({ results: results.map(toResult) });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/student/results/:id
 * A single result belonging to the current student.
 */
export async function getResult(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid result id.' });
    }

    const result = await prisma.result.findUnique({
      where: { id },
      include: { quiz: true },
    });
    // Also enforce ownership: a student can only see their own results.
    if (!result || result.studentId !== req.user.id) {
      return res.status(404).json({ message: 'Result not found.' });
    }
    return res.json({ result: toResult(result) });
  } catch (err) {
    next(err);
  }
}
