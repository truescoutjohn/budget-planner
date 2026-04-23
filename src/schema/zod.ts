import { z } from "zod";


export const accountSchema = z.object({
    type: z.enum(["CASH", "CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"]),
    balance: z.number(),
    currency: z.enum(["UAH", "EUR", "USD"]),
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
    date: z.date()
});

export const goalDepositSchema = z.object({
    amount: z.number(),
    date: z.date(),
});

export const goalSchema = z.object({
    name: z.string(),
    finalAmount: z.number(),
    currentAmount: z.number(),
    goalDeposits: z.array(goalDepositSchema)
});

export const notificationSchema = z.object({
    name: z.string(),
    date: z.date()
});

export const transactionSchema = z.object({
    amount: z.number(),
    date: z.date()
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
    locale: z.enum(["EN", "RU", "UK", "DE"]).default("EN")
});