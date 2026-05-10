"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ITransactionResponse } from "@/types/transaction";
import { useEffect, useState, useRef } from "react";
import { formatTransactionTime } from "@/utils/time";
import Search from "./search";

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<ITransactionResponse[]>([]);

  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = (func: () => void, delay: number) => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }
    timerId.current = setTimeout(() => {
      func();
    }, delay);
  };

  useEffect(() => {
    async function getTransactions() {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data as ITransactionResponse[]);
    }
    getTransactions();
  }, []);

  useEffect(() => {
    async function getTransactions() {
      const response = await fetch(`/api/transactions?search=${search}`);
      const data = await response.json();
      console.log(data);
      setTransactions(data as ITransactionResponse[]);
    }
    debouncedSearch(getTransactions, 500);
  }, [search]);

  return (
    <>
      <Search search={search} setSearch={setSearch} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.number}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{formatTransactionTime(transaction.time)}</TableCell>
              <TableCell>{transaction.comment}</TableCell>
              <TableCell>{transaction.account?.type}</TableCell>
              <TableCell>{transaction.category?.name ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionsPage;
