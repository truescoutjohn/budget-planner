import { IAccount } from "./account";
import { ICategory } from "./category";

export interface ITransaction {
  id?: number;
  number: string;
  amount: number;
  time: Date;
  comment: string;
  type_direction: string;
  accountId: number;
  categoryId: number | null;
}

export interface ITransactionResponse {
  id: number;
  number: string;
  amount: number;
  time: Date;
  comment: string;
  type_direction: string;
  account: IAccount;
  category: ICategory | null;
}
