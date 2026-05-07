import prisma from "@/lib/prisma";

import { ITransaction, ITransactionResponse } from "@/types/transaction";

const transactionsRepository = {
  createTransaction: async (
    transaction: ITransaction,
  ): Promise<ITransactionResponse> => {
    return await prisma.transaction.create({ data: transaction });
  },

  findTransactionById: async (
    transactionId: number,
  ): Promise<ITransactionResponse | null> => {
    return await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        account: true,
        category: true,
      },
    });
  },

  findTransactionBySearch: async (
    search: string,
  ): Promise<ITransactionResponse[]> => {
    const cleanSearch = search.trim();

    if (!cleanSearch) return [];
    return await prisma.transaction.findMany({
      where: {
        OR: [
          { number: { contains: cleanSearch, mode: "insensitive" } },
          { comment: { contains: cleanSearch, mode: "insensitive" } },
        ],
      },
      include: {
        account: true,
        category: true,
      },
    });
  },

  findTransactionAll: async (): Promise<ITransactionResponse[]> => {
    return await prisma.transaction.findMany({
      include: { account: true, category: true },
    });
  },

  updateTransaction: async (
    transactionId: number,
    transaction: ITransaction,
  ): Promise<ITransactionResponse | null> => {
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
  ): Promise<ITransactionResponse | null> => {
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

export default transactionsRepository;
