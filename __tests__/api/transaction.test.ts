import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/transactions/route";
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
      "http://localhost:3000/api/transaction?id=" + transaction.id,
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
      "http://localhost:3000/api/transaction?id=invalid",
      {
        method: "GET",
      },
    );

    const response = await GET(req);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("GET /api/transactions?id=99999 - should return 404", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/transaction?id=99999",
      {
        method: "GET",
      },
    );

    const response = await GET(req);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
