import prisma from "@/lib/prisma";
import { IUser } from "@/types/user";
import { ITransaction } from "@/types/transaction";

const prismaRepository = {
  createUser: async (user: IUser): Promise<IUser | null> => {
    return await prisma.user.create({
      data: user,
    });
  },

  findUser: async (email: string): Promise<IUser | null> => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  createTransaction: async (
    transaction: ITransaction,
  ): Promise<ITransaction> => {
    return await prisma.transaction.create({ data: transaction });
  },

  findTransactionById: async (
    transactionId: number,
  ): Promise<ITransaction | null> => {
    return await prisma.transaction.findUnique({
      where: { id: transactionId },
    });
  },

  findTransactionAll: async (): Promise<ITransaction[]> => {
    return await prisma.transaction.findMany();
  },

  updateTransaction: async (
    transactionId: number,
    transaction: ITransaction,
  ): Promise<ITransaction | null> => {
    try {
      return await prisma.transaction.update({
        where: { id: transactionId },
        data: transaction,
      });
    } catch (e) {
      return null;
    }
  },

  deleteTransaction: async (
    transactionId: number,
  ): Promise<ITransaction | null> => {
    try {
      const transaction = await prisma.transaction.delete({
        where: { id: transactionId },
      });
      return transaction;
    } catch (e) {
      return null;
    }
  },
};

export default prismaRepository;
