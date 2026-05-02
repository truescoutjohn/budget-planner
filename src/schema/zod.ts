import { Decimal } from "@prisma/client/runtime/index-browser";
import { z } from "zod";

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`
//TODO: Refactor it
export const accountSchema = z.object({
  type: z.enum(["CASH", "CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"]),
  balance: z.number(),
  currency: z.enum(["UAH", "EUR", "USD"]),
  userId: z.number(),
});

export type Category = {
  name: string;
  parentId?: number;
  children: Category[];
};

export const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    parentId: z.number().optional(),
    children: z.array(categorySchema),
  }),
);

export const budgetSchema = z.object({
  amount: z.number(),
  limit: z.number(),
  date: z.date(),
});

export const goalDepositSchema = z.object({
  amount: z.number(),
  date: z.date(),
});

export const goalSchema = z.object({
  name: z.string(),
  finalAmount: z.number(),
  currentAmount: z.number(),
  goalDeposits: z.array(goalDepositSchema),
});

export const notificationSchema = z.object({
  name: z.string(),
  date: z.date(),
});

export const transactionSchema = z.object({
  amount: z.number(),
  date: z.date(),
});

export const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().optional(),
  accounts: z.array(accountSchema),
  categories: z.array(categorySchema),
  budgets: z.array(budgetSchema),
  goals: z.array(goalSchema),
  notifications: z.array(notificationSchema),
  locale: z.enum(["EN", "RU", "UK", "DE"]).default("EN"),
});

export const loginSchema = z.object({
  email: z.email("Incorrect email"),
  password: z.string().min(8, "Incorrect password"),
});

export const registrationSchema = z
  .object({
    email: z.email("Incorrect email"),
    password: z.string().min(8, "Incorrect password"),
    confirmPassword: z.string().min(8, "Incorrect confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
