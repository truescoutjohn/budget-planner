/** API/JSON часто даёт строку ISO, Prisma-подобный тип — `Date`. */
export function formatTransactionTime(value: Date | string | number): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat([], {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(d);
}
