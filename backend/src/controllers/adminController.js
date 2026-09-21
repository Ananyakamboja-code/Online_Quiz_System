import prisma from '../prismaClient.js';

/**
 * Admin controller: dashboard aggregates and faculty listing.
 */

/** GET /api/admin/stats — summary counts for the dashboard cards. */
export async function getStats(_req, res, next) {
  try {
    const [totalUsers, totalStudents, totalFaculty, totalQuizzes] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.quiz.count(),
    ]);
    res.json({ totalUsers, totalStudents, totalFaculty, totalQuizzes });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/faculty — list FACULTY users with how many quizzes each
 * created and their status. Shapes to match the Faculty Details table.
 */
export async function listFaculty(_req, res, next) {
  try {
    const faculty = await prisma.user.findMany({
      where: { role: 'FACULTY' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        _count: { select: { quizzes: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json(
      faculty.map((f) => ({
        id: f.id,
        name: f.name,
        email: f.email,
        status: f.status,
        quizzesCreated: f._count.quizzes,
      }))
    );
  } catch (err) {
    next(err);
  }
}
