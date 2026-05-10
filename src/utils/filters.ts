import { Filter } from "@/components/reui/filters";
import { ITransactionResponse } from "@/types/transaction";

export const getActiveFilters = (filters: Filter[]) => {
  return filters.filter((filter) => {
    const { values } = filter;

    // Check if filter has meaningful values
    if (!values || values.length === 0) return false;

    // For text/string values, check if they're not empty strings
    if (
      values.every((value) => typeof value === "string" && value.trim() === "")
    )
      return false;

    // For number values, check if they're not null/undefined
    if (values.every((value) => value === null || value === undefined))
      return false;

    // For arrays, check if they're not empty
    if (values.every((value) => Array.isArray(value) && value.length === 0))
      return false;

    return true;
  });
};

export function applyFiltersToTransactions(
  transactions: ITransactionResponse[],
  newFilters: Filter[],
): ITransactionResponse[] {
  let filtered = [...transactions];

  const activeFilters = getActiveFilters(newFilters);

  activeFilters.forEach((filter) => {
    const { field, operator, values } = filter;

    filtered = filtered.filter((item) => {
      const fieldValue = item[field as keyof ITransactionResponse];

      switch (operator) {
        case "is":
          return values.includes(fieldValue);
        case "is_not":
          return !values.includes(fieldValue);
        case "contains":
          return values.some((value) =>
            String(fieldValue)
              .toLowerCase()
              .includes(String(value).toLowerCase()),
          );
        case "not_contains":
          return !values.some((value) =>
            String(fieldValue)
              .toLowerCase()
              .includes(String(value).toLowerCase()),
          );
        case "equals":
          return fieldValue === values[0];
        case "not_equals":
          return fieldValue !== values[0];
        case "greater_than":
          return Number(fieldValue) > Number(values[0]);
        case "less_than":
          return Number(fieldValue) < Number(values[0]);
        case "greater_than_or_equal":
          return Number(fieldValue) >= Number(values[0]);
        case "less_than_or_equal":
          return Number(fieldValue) <= Number(values[0]);
        case "between":
          if (values.length >= 2) {
            const min = Number(values[0]);
            const max = Number(values[1]);
            return Number(fieldValue) >= min && Number(fieldValue) <= max;
          }
          return true;
        case "not_between":
          if (values.length >= 2) {
            const min = Number(values[0]);
            const max = Number(values[1]);
            return Number(fieldValue) < min || Number(fieldValue) > max;
          }
          return true;
        case "before":
          return new Date(String(fieldValue)) < new Date(String(values[0]));
        case "after":
          return new Date(String(fieldValue)) > new Date(String(values[0]));
        default:
          return true;
      }
    });
  });

  return filtered;
}
