import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function main() {
  console.log("Starting database cleanup...");
  await prisma.notification.deleteMany();
  await prisma.goalDeposit.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleaned.");

  const user = await prisma.user.create({
    data: {
      email: "dev.ivanov@gmail.com",
      name: "Ivan Ivanov",
      passwordHash: bcrypt.hashSync("123456789", 10),
      locale: "EN",
    },
  });

  await prisma.account.createMany({
    data: [
      {
        type: "CHECKING",
        balance: 55000.5,
        currency: "UAH",
        userId: user.id,
      },
      {
        type: "SAVINGS",
        balance: 1200,
        currency: "USD",
        userId: user.id,
      },
    ],
  });

  const mainAccount = await prisma.account.findFirst({
    where: { userId: user.id, type: "CHECKING" },
    orderBy: { id: "asc" },
  });

  const foodCategory = await prisma.category.create({
    data: { name: "Продукты", userId: user.id },
  });

  await prisma.category.createMany({
    data: [
      { name: "Овощи", userId: user.id, parentId: foodCategory.id },
      { name: "Мясо", userId: user.id, parentId: foodCategory.id },
    ],
  });

  const salaryCategory = await prisma.category.create({
    data: { name: "Зарплата", userId: user.id },
  });

  const goal = await prisma.goal.create({
    data: {
      name: "RedmiBook 16 2025",
      finalAmount: 45000,
      currentAmount: 5000,
      userId: user.id,
    },
  });

  await prisma.goalDeposit.createMany({
    data: [
      { amount: 2000, date: new Date(), goalId: goal.id },
      { amount: 3000, date: new Date(), goalId: goal.id },
    ],
  });

  if (mainAccount && salaryCategory) {
    await prisma.transaction.create({
      data: {
        type_storage: "CARD",
        type_direction: "INCOME",
        number: "TXN-1001",
        amount: 45000.0,
        time: new Date(),
        comment: "First salary in the new company",
        accountId: mainAccount.id,
        categoryId: salaryCategory.id,
      },
    });

    await prisma.transaction.create({
      data: {
        type_storage: "CARD",
        type_direction: "EXPENSES",
        number: "TXN-1002",
        amount: 1000.0,
        time: new Date(),
        accountId: mainAccount.id,
        categoryId: foodCategory.id,
      },
    });
    await prisma.transaction.create({
      data: {
        type_storage: "CARD",
        type_direction: "EXPENSES",
        number: "TXN-1003",
        amount: 1000.0,
        time: new Date(),
        accountId: mainAccount.id,
        categoryId: foodCategory.id,
      },
    });
  }

  if (foodCategory) {
    await prisma.budget.create({
      data: {
        amount: 0,
        limit: 8000.0,
        date: new Date(),
        userId: user.id,
        categoryId: foodCategory.id,
      },
    });
  }

  console.log("Seeding completed successfully!");
}
