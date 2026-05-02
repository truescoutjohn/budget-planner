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
