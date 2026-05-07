import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET, PUT, DELETE } from "@/app/api/transactions/route";
import { NextRequest } from "next/server";
import { StatusCodes } from "http-status-codes";
import transactionsRepository from "@/utils/repository/transactions";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

describe("Transaction API Endpoints", () => {
  let testAccount: any;

  beforeEach(async () => {
    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: "api@test.com",
        name: "API User",
        passwordHash: bcrypt.hashSync("123", 10),
      },
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
    await transactionsRepository.createTransaction({
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
    const transaction = await transactionsRepository.createTransaction({
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
    await transactionsRepository.createTransaction({
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
    await transactionsRepository.createTransaction({
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
