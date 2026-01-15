import { prisma } from "./prisma";

const TABLES = ["brandMaster", "user", "vM"];

export async function resetDb() {
  for (const t of TABLES) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE;`,
    );
  }
}
