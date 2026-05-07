"use client";

import TableRootComponent from "@/components/ui/table";
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
      <TableRootComponent.Table>
        <TableRootComponent.TableHeader>
          <TableRootComponent.TableRow>
            <TableRootComponent.TableHead>Number</TableRootComponent.TableHead>
            <TableRootComponent.TableHead>Amount</TableRootComponent.TableHead>
            <TableRootComponent.TableHead>Time</TableRootComponent.TableHead>
            <TableRootComponent.TableHead>Comment</TableRootComponent.TableHead>
            <TableRootComponent.TableHead>Account</TableRootComponent.TableHead>
            <TableRootComponent.TableHead>
              Category
            </TableRootComponent.TableHead>
          </TableRootComponent.TableRow>
        </TableRootComponent.TableHeader>
        <TableRootComponent.TableBody>
          {transactions?.map((transaction) => (
            <TableRootComponent.TableRow key={transaction.id}>
              <TableRootComponent.TableCell>
                {transaction.number}
              </TableRootComponent.TableCell>
              <TableRootComponent.TableCell>
                {transaction.amount}
              </TableRootComponent.TableCell>
              <TableRootComponent.TableCell>
                {formatTransactionTime(transaction.time)}
              </TableRootComponent.TableCell>
              <TableRootComponent.TableCell>
                {transaction.comment}
              </TableRootComponent.TableCell>
              <TableRootComponent.TableCell>
                {transaction.account?.type}
              </TableRootComponent.TableCell>
              <TableRootComponent.TableCell>
                {transaction.category?.name ?? "-"}
              </TableRootComponent.TableCell>
            </TableRootComponent.TableRow>
          ))}
        </TableRootComponent.TableBody>
      </TableRootComponent.Table>
    </>
  );
};

export default TransactionsPage;
