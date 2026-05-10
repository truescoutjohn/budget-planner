import type { FilterFieldConfig } from "@/components/reui/filters";
import {
  BanknoteIcon,
  ClockIcon,
  CurrencyIcon,
  HashIcon,
  MessageSquareIcon,
  TagIcon,
} from "lucide-react";

export const TRANSACTION_FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "number",
    label: "Number",
    icon: <HashIcon className="size-3.5" />,
    type: "text",
    className: "w-40",
    placeholder: "Search number...",
  },
  {
    key: "amount",
    label: "Amount",
    icon: <CurrencyIcon className="size-3.5" />,
    type: "number",
    className: "w-40",
    placeholder: "Search amount...",
  },
  {
    key: "time",
    label: "Time",
    icon: <ClockIcon className="size-3.5" />,
    type: "date",
    className: "w-40",
    placeholder: "Search time...",
  },
  {
    key: "comment",
    label: "Comment",
    icon: <MessageSquareIcon className="size-3.5" />,
    type: "text",
    className: "w-40",
    placeholder: "Search comment...",
  },
  {
    key: "account",
    label: "Account",
    icon: <BanknoteIcon className="size-3.5" />,
    type: "select",
    className: "w-40",
    placeholder: "Search account...",
  },
  {
    key: "category",
    label: "Category",
    icon: <TagIcon className="size-3.5" />,
    type: "select",
    className: "w-40",
    placeholder: "Search category...",
  },
];
