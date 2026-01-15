import { beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "./prisma";
import { resetDb } from "./resetDb";

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});
