import type { ITransaction } from "@/types/transaction";

export function formatTransactionTime(value: ITransaction["time"]): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat([], {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}
