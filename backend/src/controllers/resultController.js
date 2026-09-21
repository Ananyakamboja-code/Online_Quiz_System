import prisma from '../prismaClient.js';

/**
 * Result controller (Admin, read-only).
 *
 * Lists all quiz results with student name, quiz title, the faculty who created
 * the quiz, score, total questions, computed percentage, and submission date.
 */

/** GET /api/admin/results */
export async function listResults(_req, res, next) {
  try {
    const results = await prisma.result.findMany({
      include: {
        student: { select: { id: true, name: true } },
        quiz: {
          select: {
            id: true,
            title: true,
            faculty: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json(
      results.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        studentName: r.student?.name ?? null,
        quizId: r.quizId,
        quizTitle: r.quiz?.title ?? null,
        facultyName: r.quiz?.faculty?.name ?? null,
        score: r.score,
        totalQuestions: r.totalQuestions,
        percentage:
          r.totalQuestions > 0
            ? Math.round((r.score / r.totalQuestions) * 100)
            : 0,
        submittedAt: r.submittedAt,
      }))
    );
  } catch (err) {
    next(err);
  }
}
