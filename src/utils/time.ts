import type { ITransaction } from "@/types/transaction";

export function formatTransactionTime(value: ITransaction["time"]): string {
  const d = new Date(value as unknown as string);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}
