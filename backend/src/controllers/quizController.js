import prisma from '../prismaClient.js';

/**
 * Quiz controller (Admin) — adapted to the shared schema on main.
 *
 * Admin manages quiz-level data. Each quiz is owned by a FACULTY user
 * (quiz.facultyId -> User.id). Responses are flattened to include facultyName
 * and questionCount so the frontend can render its table without extra calls.
 *
 * Shared schema notes (from faculty branch, merged in main):
 *   - Quiz has required numberOfQuestions/startDate/endDate + status
 *   - Result model is StudentResult (not Result)
 *   - Question.text field is `question` (not questionText)
 */

const quizInclude = {
  faculty: { select: { id: true, name: true } },
  _count: { select: { questions: true } },
};

function toQuizDto(quiz) {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    duration: quiz.duration,
    numberOfQuestions: quiz.numberOfQuestions,
    startDate: quiz.startDate,
    endDate: quiz.endDate,
    status: quiz.status,
    facultyId: quiz.facultyId,
    facultyName: quiz.faculty?.name ?? null,
    questionCount: quiz._count?.questions ?? undefined,
    createdAt: quiz.createdAt,
  };
}

/** GET /api/admin/quizzes */
export async function listQuizzes(_req, res, next) {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: quizInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(quizzes.map(toQuizDto));
  } catch (err) {
    next(err);
  }
}

/** GET /api/admin/quizzes/:id */
export async function getQuiz(req, res, next) {
  try {
    const id = Number(req.params.id);
    const quiz = await prisma.quiz.findUnique({ where: { id }, include: quizInclude });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(toQuizDto(quiz));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/quizzes
 * Body: { title, description, duration, facultyId,
 *         numberOfQuestions?, startDate?, endDate?, status? }
 *
 * The frontend Admin form only asks for title/description/duration/faculty.
 * The shared schema requires the extras — we accept them if provided, else
 * default to safe values so the Admin flow keeps working.
 */
export async function createQuiz(req, res, next) {
  try {
    const title = String(req.body.title || '').trim();
    const description = String(req.body.description || '').trim();
    const duration = Number(req.body.duration);
    const facultyId = Number(req.body.facultyId);

    if (!title) return res.status(400).json({ message: 'Title is required.' });
    if (!description) return res.status(400).json({ message: 'Description is required.' });
    if (!Number.isFinite(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive number.' });
    }
    if (!Number.isInteger(facultyId)) {
      return res.status(400).json({ message: 'A valid facultyId is required.' });
    }

    // Ensure the referenced user exists and is a FACULTY member.
    const faculty = await prisma.user.findUnique({ where: { id: facultyId } });
    if (!faculty || faculty.role !== 'FACULTY') {
      return res.status(400).json({ message: 'facultyId must reference a FACULTY user.' });
    }

    // Extras required by the shared schema — accept from body or apply defaults.
    const numberOfQuestions = Number.isFinite(Number(req.body.numberOfQuestions))
      ? Number(req.body.numberOfQuestions)
      : 0;
    const now = new Date();
    const startDate = req.body.startDate ? new Date(req.body.startDate) : now;
    const endDate = req.body.endDate
      ? new Date(req.body.endDate)
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days default
    const status = req.body.status ? String(req.body.status) : 'Draft';

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        duration,
        facultyId,
        numberOfQuestions,
        startDate,
        endDate,
        status,
      },
      include: quizInclude,
    });
    res.status(201).json(toQuizDto(quiz));
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/quizzes/:id
 * Body may include any of: title, description, duration, facultyId,
 * numberOfQuestions, startDate, endDate, status
 */
export async function updateQuiz(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Quiz not found.' });

    const data = {};
    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();
      if (!title) return res.status(400).json({ message: 'Title cannot be empty.' });
      data.title = title;
    }
    if (req.body.description !== undefined) {
      const description = String(req.body.description).trim();
      if (!description) return res.status(400).json({ message: 'Description cannot be empty.' });
      data.description = description;
    }
    if (req.body.duration !== undefined) {
      const duration = Number(req.body.duration);
      if (!Number.isFinite(duration) || duration <= 0) {
        return res.status(400).json({ message: 'Duration must be a positive number.' });
      }
      data.duration = duration;
    }
    if (req.body.facultyId !== undefined) {
      const facultyId = Number(req.body.facultyId);
      const faculty = await prisma.user.findUnique({ where: { id: facultyId } });
      if (!faculty || faculty.role !== 'FACULTY') {
        return res.status(400).json({ message: 'facultyId must reference a FACULTY user.' });
      }
      data.facultyId = facultyId;
    }
    if (req.body.numberOfQuestions !== undefined) {
      data.numberOfQuestions = Number(req.body.numberOfQuestions);
    }
    if (req.body.startDate !== undefined) data.startDate = new Date(req.body.startDate);
    if (req.body.endDate !== undefined) data.endDate = new Date(req.body.endDate);
    if (req.body.status !== undefined) data.status = String(req.body.status);

    const quiz = await prisma.quiz.update({ where: { id }, data, include: quizInclude });
    res.json(toQuizDto(quiz));
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/admin/quizzes/:id */
export async function deleteQuiz(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Quiz not found.' });

    // Questions and results cascade via schema relations.
    await prisma.quiz.delete({ where: { id } });
    res.json({ id, deleted: true });
  } catch (err) {
    next(err);
  }
}
