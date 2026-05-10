import { IAccount } from "./account";
import { ICategory } from "./category";

export interface ITransaction {
  id?: number;
  number: String;
  amount: number;
  time: Date;
  comment: String;
  type_direction: String;
  accountId: number;
  categoryId: number | null;
}

export interface ITransactionResponse {
  id: number;
  number: String;
  amount: number;
  time: Date;
  comment: String;
  type_direction: String;
  account: IAccount;
  category: ICategory | null;
}
