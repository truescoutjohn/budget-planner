import { userSchema } from "@/schema/zod";
import { transactionSchema } from "@/schema/zod";

export const usersPrompt = (count: number) => {
  return `Generate ${count} users with the following schema: ${userSchema.toString()}`;
};

export const transactionsPrompt = (count: number) => {
  return `Generate ${count} trasaction with the following schema: ${transactionSchema.toString()}`;
};
