import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET, PUT, DELETE } from "@/app/api/transactions/route";
import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import prismaRepository from "@/utils/prismaRepository";
import prisma from "@/lib/prisma";
import type { ITransaction } from "@/types/transaction";

describe("Transaction CRUD", () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should create and find a transaction", async () => {
    const user = await prisma.user.create({
      data: { email: "test@test.com", name: "Test User", password: "123" },
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

    const created = await prismaRepository.createTransaction(mockData);
    expect(created).toHaveProperty("id");
    expect(Number(created.amount)).toBe(500);

    const { id } = created as ITransaction & { id: number };
    const found = await prismaRepository.findTransactionById(id);
    expect(found?.number).toBe(String(mockData.number));
  });

  it("should return null if transaction not found", async () => {
    const found = await prismaRepository.findTransactionById(99999);
    expect(found).toBeNull();
  });

  it("should return all transactions", async () => {
    const transactions = await prismaRepository.findTransactionAll();
    expect(transactions).toBeDefined();
    expect(transactions.length).toBe(0);
  });

  it("should update a transaction", async () => {
    const user = await prisma.user.create({
      data: { email: "test@test.com", name: "Test User", password: "123" },
    });

    const account = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 123.23 },
    });

    const transaction = JSON.parse(
      JSON.stringify(
        await prismaRepository.createTransaction({
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
        await prismaRepository.updateTransaction(transaction?.id as number, {
          number: "GET-2",
          amount: 10.23,
          time: new Date("2026-05-02T17:07:58.352Z"),
          type_direction: "EXPENSES",
          accountId: account.id,
          comment: "test",
          categoryId: null,
        }),
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
      data: { email: "test@test.com", name: "Test User", password: "123" },
    });

    const account = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 123.23 },
    });

    const transaction = JSON.parse(
      JSON.stringify(
        await prismaRepository.createTransaction({
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
        await prismaRepository.deleteTransaction(transaction?.id as number),
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

describe("Transaction API Endpoints", () => {
  let testAccount: any;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: "api@test.com", name: "API User", password: "123" },
    });
    testAccount = await prisma.account.create({
      data: { type: "SAVINGS", userId: user.id, balance: 1000 },
    });
  });

  it("POST /api/transactions - should create transaction and return 201", async () => {
    const payload = {
      number: "API-101",
      amount: 250,
      time: new Date().toISOString(),
      type_direction: "EXPENSES",
      comment: "Coffee",
      accountId: testAccount.id,
      categoryId: null,
    };

    const req = new NextRequest("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const body = await response.text();

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(body).toBe("Transaction is created successfully");

    const dbCount = await prisma.transaction.count();
    expect(dbCount).toBe(1);
  });

  it("GET /api/transactions - should return all transactions", async () => {
    await prismaRepository.createTransaction({
      id: 123,
      number: "GET-1",
      amount: 10,
      time: new Date(),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
      comment: "test",
      categoryId: null,
    });

    const req = new NextRequest("http://localhost:3000/api/transactions", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].number).toBe("GET-1");
  });

  it("GET /api/transactions?id=123 - should return a certain transaction", async () => {
    const transaction = await prismaRepository.createTransaction({
      id: 123,
      number: "GET-1",
      amount: 10.23,
      time: new Date("2026-05-02T17:07:58.352Z"),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
      comment: "test",
      categoryId: null,
    });

    const req = new NextRequest(
      "http://localhost:3000/api/transactions?id=" + transaction.id,
      {
        method: "GET",
      },
    );

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.OK);
    expect(data).toHaveProperty("id");
    expect(data.number).toBe("GET-1");
    expect(data.amount).toBe(10.23);
    expect(data.time).toBe("2026-05-02T17:07:58.352Z");
    expect(data.type_direction).toBe("EXPENSES");
    expect(data.accountId).toBe(testAccount.id);
    expect(data.comment).toBe("test");
    expect(data.categoryId).toBeNull();
  });

  it("GET /api/transactions?id=invalid - should return 400", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/transactions?id=invalid",
      {
        method: "GET",
      },
    );

    const response = await GET(req);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("GET /api/transactions?id=99999 - should return 404", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/transactions?id=99999",
      {
        method: "GET",
      },
    );

    const response = await GET(req);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("PUT /api/transactions?id=123 - should update a transaction", async () => {
    await prismaRepository.createTransaction({
      id: 123,
      number: "GET-1",
      amount: 10.23,
      time: new Date("2026-05-02T17:07:58.352Z"),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
      comment: "test",
      categoryId: null,
    });

    const payload = {
      id: 123,
      number: "PUT-1",
      amount: 10.23,
      comment: "test",
      time: new Date("2026-05-02T17:07:58.352Z"),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
      categoryId: null,
    };

    const req = new NextRequest(
      "http://localhost:3000/api/transactions?id=123",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const response = await PUT(req);
    const data = await response?.json();

    expect(response?.status).toBe(StatusCodes.OK);
    expect(data).toHaveProperty("id");
    expect(data.number).toBe("PUT-1");
    expect(data.amount).toBe(10.23);
    expect(data.time).toBe("2026-05-02T17:07:58.352Z");
    expect(data.type_direction).toBe("EXPENSES");
    expect(data.accountId).toBe(testAccount.id);
    expect(data.comment).toBe("test");
    expect(data.categoryId).toBeNull();
  });

  it("PUT /api/transactions - should return 404 when body has no transaction id", async () => {
    const payload = {
      number: "PUT-1",
      amount: 10.23,
      time: new Date("2026-05-02T17:07:58.352Z"),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
    };
    const req = new NextRequest("http://localhost:3000/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const response = await PUT(req);
    expect(response?.status).toBe(StatusCodes.NOT_FOUND);
    expect(await response?.text()).toBe("No any transaction");
  });

  it("DELETE /api/transactions?id=123 - should delete a transaction", async () => {
    await prismaRepository.createTransaction({
      id: 123,
      number: "DELETE-1",
      amount: 10.23,
      comment: "test",
      categoryId: null,
      time: new Date("2026-05-02T17:07:58.352Z"),
      type_direction: "EXPENSES",
      accountId: testAccount.id,
    });
    const req = new NextRequest(
      "http://localhost:3000/api/transactions?id=123",
      {
        method: "DELETE",
      },
    );
    const response = await DELETE(req);
    expect(response?.status).toBe(StatusCodes.OK);
    expect(await response?.text()).toBe("Transaction is deleted successfully");
  });
});
