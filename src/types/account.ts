import { IUser } from "./user";

export interface IAccount {
  id: number;
  name: string;
  balance: number;
  currency: string;
  type: string;
  user: IUser;
}
