/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const existingAdmin = await prisma.user.findUnique({
    where: { idUser: "00000000-0000-0000-0000-000000000001" },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        idUser: "00000000-0000-0000-0000-000000000001",
        username: "admin",
        email: "admin@vituax.com",
        password: adminPassword,
        role: "admin",
        isActive: true,
      },
    });
  } else {
    console.log("Admin já existe: ", existingAdmin.email);
  }

  const managerPassword = await bcrypt.hash("manager123", 10);
  const existingManager = await prisma.user.findUnique({
    where: { idUser: "00000000-0000-0000-0000-000000000002" },
  });

  if (!existingManager) {
    await prisma.user.create({
      data: {
        idUser: "00000000-0000-0000-0000-000000000002",
        username: "manager",
        email: "manager@vituax.com",
        password: managerPassword,
        role: "manager",
        isActive: true,
      },
    });
  } else {
    console.log("Manager já existe:", existingManager.email);
  }

  const memberPassword = await bcrypt.hash("member123", 10);
  const existingMember = await prisma.user.findUnique({
    where: { idUser: "00000000-0000-0000-0000-000000000003" },
  });

  if (!existingMember) {
    await prisma.user.create({
      data: {
        idUser: "00000000-0000-0000-0000-000000000003",
        username: "member",
        email: "member@vituax.com",
        password: memberPassword,
        role: "member",
        isActive: true,
      },
    });
  } else {
    console.log("Member já existe:", existingMember.email);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro ao inserir usuários:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
