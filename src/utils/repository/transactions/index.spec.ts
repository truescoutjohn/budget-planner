import { describe, beforeEach, it, expect } from "vitest";
import prisma from "@/lib/prisma";
import transactionsRepository from ".";
import type { ITransaction } from "@/types/transaction";
import bcrypt from "bcrypt";

describe("Transaction CRUD", () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create and find a transaction", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        name: "Test User",
        passwordHash: bcrypt.hashSync("123", 10),
      },
    });

    const account = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 123.23 },
    });

    const mockData: ITransaction = {
      id: 123,
      number: "TX-100",
      amount: 500,
      time: new Date(),
      type_direction: "INCOME",
      comment: "Test",
      accountId: account.id,
      categoryId: null,
    };

    const created = await transactionsRepository.createTransaction(mockData);
    expect(created).toHaveProperty("id");
    expect(Number(created.amount)).toBe(500);

    const { id } = created;
    const found = await transactionsRepository.findTransactionById(id);
    expect(found?.number).toBe(String(mockData.number));
  });

  it("should return null if transaction not found", async () => {
    const found = await transactionsRepository.findTransactionById(99999);
    expect(found).toBeNull();
  });

  it("should return all transactions", async () => {
    const transactions = await transactionsRepository.findTransactionAll();
    expect(transactions).toBeDefined();
    expect(transactions.length).toBe(0);
  });

  it("should update a transaction", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        name: "Test User",
        passwordHash: bcrypt.hashSync("123", 10),
      },
    });

    const account = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 123.23 },
    });

    const transaction = JSON.parse(
      JSON.stringify(
        await transactionsRepository.createTransaction({
          id: 123,
          number: "GET-1",
          amount: 10.23,
          time: new Date("2026-05-02T17:07:58.352Z"),
          type_direction: "EXPENSES",
          accountId: account.id,
          comment: "test",
          categoryId: null,
        }),
      ),
    );

    const updated = JSON.parse(
      JSON.stringify(
        await transactionsRepository.updateTransaction(
          transaction?.id as number,
          {
            number: "GET-2",
            amount: 10.23,
            time: new Date("2026-05-02T17:07:58.352Z"),
            type_direction: "EXPENSES",
            accountId: account.id,
            comment: "test",
            categoryId: null,
          },
        ),
      ),
    );

    expect(updated?.number).toBe("GET-2");
    expect(updated?.amount).toBe("10.23");
    expect(updated?.time).toBe("2026-05-02T17:07:58.352Z");
    expect(updated?.type_direction).toBe("EXPENSES");
    expect(updated?.accountId).toBe(account.id);
    expect(updated?.comment).toBe("test");
    expect(updated?.categoryId).toBeNull();
  });

  it("should delete a transaction", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        name: "Test User",
        passwordHash: bcrypt.hashSync("123", 10),
      },
    });

    const account = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 123.23 },
    });

    const transaction = JSON.parse(
      JSON.stringify(
        await transactionsRepository.createTransaction({
          id: 123,
          number: "GET-1",
          amount: 10.23,
          time: new Date("2026-05-02T17:07:58.352Z"),
          type_direction: "EXPENSES",
          accountId: account.id,
          comment: "test",
          categoryId: null,
        }),
      ),
    );

    const deleted = JSON.parse(
      JSON.stringify(
        await transactionsRepository.deleteTransaction(
          transaction?.id as number,
        ),
      ),
    );
    expect(deleted?.id).toBe(transaction?.id);
    expect(deleted?.number).toBe(transaction?.number);
    expect(deleted?.amount).toBe(transaction?.amount);
    expect(deleted?.time).toBe(transaction?.time);
    expect(deleted?.type_direction).toBe(transaction?.type_direction);
    expect(deleted?.accountId).toBe(transaction?.accountId);
    expect(deleted?.comment).toBe(transaction?.comment);
    expect(deleted?.categoryId).toBe(transaction?.categoryId);
  });
});
