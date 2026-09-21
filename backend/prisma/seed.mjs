import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed script for the Online Quiz System.
 *
 * Creates a faculty owner plus a few quizzes and questions so the Student
 * module endpoints have realistic data to return. Idempotent-ish: it clears
 * quizzes/questions/results before reseeding so re-running gives a clean set.
 *
 * Run with:  node prisma/seed.mjs
 */
const prisma = new PrismaClient();

async function main() {
  // Clear quiz-related data (keep users). Order matters due to FKs.
  await prisma.result.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  // Ensure a faculty user exists to own the quizzes.
  const facultyEmail = "faculty.seed@example.com";
  let faculty = await prisma.user.findUnique({ where: { email: facultyEmail } });
  if (!faculty) {
    faculty = await prisma.user.create({
      data: {
        name: "Seed Faculty",
        email: facultyEmail,
        password: await bcrypt.hash("Faculty@123", 10),
        role: "FACULTY",
      },
    });
  }

  const quizzes = [
    {
      title: "JavaScript Fundamentals",
      description:
        "Core JavaScript concepts: variables, functions, scope, and data types.",
      duration: 10,
      questions: [
        {
          questionText:
            "Which keyword declares a block-scoped variable in JavaScript?",
          optionA: "var",
          optionB: "let",
          optionC: "function",
          optionD: "static",
          correctAnswer: "B",
        },
        {
          questionText: "What is the result of typeof null?",
          optionA: '"null"',
          optionB: '"undefined"',
          optionC: '"object"',
          optionD: '"number"',
          correctAnswer: "C",
        },
        {
          questionText:
            "Which method converts a JSON string into a JavaScript object?",
          optionA: "JSON.stringify()",
          optionB: "JSON.parse()",
          optionC: "JSON.object()",
          optionD: "JSON.toObject()",
          correctAnswer: "B",
        },
      ],
    },
    {
      title: "React Basics",
      description:
        "Components, props, state, and hooks — foundational React understanding.",
      duration: 15,
      questions: [
        {
          questionText:
            "What hook is used to add state to a functional component?",
          optionA: "useEffect",
          optionB: "useState",
          optionC: "useRef",
          optionD: "useContext",
          correctAnswer: "B",
        },
        {
          questionText: "How are data passed from a parent to a child component?",
          optionA: "State",
          optionB: "Context only",
          optionC: "Props",
          optionD: "Refs",
          correctAnswer: "C",
        },
      ],
    },
    {
      title: "SQL & Databases",
      description: "Relational database concepts, joins, and basic queries.",
      duration: 12,
      questions: [
        {
          questionText: "Which SQL clause is used to filter rows?",
          optionA: "ORDER BY",
          optionB: "GROUP BY",
          optionC: "WHERE",
          optionD: "HAVING",
          correctAnswer: "C",
        },
        {
          questionText:
            "Which JOIN returns only matching rows from both tables?",
          optionA: "LEFT JOIN",
          optionB: "RIGHT JOIN",
          optionC: "FULL OUTER JOIN",
          optionD: "INNER JOIN",
          correctAnswer: "D",
        },
      ],
    },
  ];

  for (const q of quizzes) {
    await prisma.quiz.create({
      data: {
        title: q.title,
        description: q.description,
        duration: q.duration,
        createdById: faculty.id,
        questions: { create: q.questions },
      },
    });
  }

  const count = await prisma.quiz.count();
  console.log(`Seeded ${count} quizzes owned by faculty #${faculty.id}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
