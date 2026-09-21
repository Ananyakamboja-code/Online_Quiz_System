import { PrismaClient } from '@prisma/client';

/**
 * Single shared Prisma client for the app.
 * Reusing one instance avoids exhausting DB connections.
 */
const prisma = new PrismaClient();

export default prisma;
