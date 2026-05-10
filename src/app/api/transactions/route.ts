import { NextRequest, NextResponse } from "next/server";
import transactionsRepository from "@/utils/repository/transactions";
import { ITransaction } from "@/types/transaction";
import { StatusCodes } from "http-status-codes";

export async function POST(request: NextRequest) {
  const {
    number,
    amount,
    time,
    comment,
    type_direction,
    accountId,
    categoryId,
  }: ITransaction = await request.json();
  try {
    const transaction = await transactionsRepository.createTransaction({
      number,
      amount,
      time,
      type_direction,
      accountId,
      comment,
      categoryId,
    });

    if (!transaction) {
      return new NextResponse("Transaction isn't created", {
        status: StatusCodes.BAD_REQUEST,
      });
    }
  } catch (e) {
    return new NextResponse("Transaction isn't created", {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  return new NextResponse("Transaction is created successfully", {
    status: StatusCodes.CREATED,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search");

  try {
    if (!id && !search) {
      //TODO make pagination
      const transactions = await transactionsRepository.findTransactionAll();

      const mappedTransactions = transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      }));

      return NextResponse.json(mappedTransactions);
    }

    if (search) {
      const transactions =
        await transactionsRepository.findTransactionBySearch(search);
      return NextResponse.json(transactions);
    }

    const transactionId = Number(id);
    if (!Number.isInteger(transactionId) || transactionId < 1) {
      return new NextResponse("Invalid id", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const transaction =
      await transactionsRepository.findTransactionById(transactionId);
    if (!transaction) {
      return new NextResponse("Transaction not found", {
        status: StatusCodes.NOT_FOUND,
      });
    }

    transaction.amount = Number(transaction.amount);

    return NextResponse.json(transaction);
  } catch {
    return new NextResponse("Failed to fetch transactions", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PUT(request: NextRequest) {
  const {
    id,
    number,
    amount,
    time,
    comment,
    accountId,
    categoryId,
    type_direction,
  }: ITransaction = await request.json();
  try {
    if (!id) {
      return new NextResponse("No any transaction", {
        status: StatusCodes.NOT_FOUND,
      });
    }
    const transaction = await transactionsRepository.updateTransaction(id, {
      number,
      amount,
      time,
      comment,
      type_direction,
      accountId,
      categoryId,
    });
    if (transaction?.id !== Number(id)) {
      return new NextResponse("Transaction didn't update", {
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (!transaction) {
      return new NextResponse("Transaction didn't update", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const body = { ...transaction, amount: Number(transaction.amount) };
    return NextResponse.json(body, { status: StatusCodes.OK });
  } catch (e) {
    return new NextResponse("Failed to update transaction", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  try {
    if (!Number.isInteger(id) || id < 1) {
      return new NextResponse("Invalid id", {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const transaction = await transactionsRepository.deleteTransaction(id);

    if (transaction?.id !== Number(id)) {
      return new NextResponse("Transaction isn't deleted", {
        status: StatusCodes.NOT_FOUND,
      });
    }

    if (!transaction) {
      return new NextResponse("Transaction isn't deleted", {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return new NextResponse("Transaction is deleted successfully", {
      status: StatusCodes.OK,
    });
  } catch {
    return new NextResponse(
      "Transaction isn't deleted through internal server error",
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
