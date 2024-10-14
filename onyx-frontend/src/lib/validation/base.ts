import { z } from "zod";

import {
  DATE_PERIOD_OPTIONS,
  DEFAULT_MONTH_STRING,
  DEFAULT_PERIOD_OPTION,
  DEFAULT_YEAR_STRING,
} from "@/lib/constants/date";
import { ACCOUNT_TYPES } from "@/lib/constants/account";
import { ALL_CURRENCIES } from "@/lib/constants/currency";
import { isValidIsoDate } from "@/lib/utils";

export const RequiredString = z.string().min(1, "Required.");

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const CurrencySchema = z.enum(ALL_CURRENCIES);

export const MoneySchema = z.object({
  currency: CurrencySchema,
  amount: z.number(),
});

export type Money = z.infer<typeof MoneySchema>;

export const MonthDateSchema = z.object({
  month: z.number(),
  year: z.number(),
});

export type MonthDate = z.infer<typeof MonthDateSchema>;

export const ResultSchema = z.object({
  isSuccess: z.boolean(),
  isFailure: z.boolean(),
  error: ErrorSchema,
});

export type BaseResult = z.infer<typeof ResultSchema>;

export interface ExtendedResult<T> extends BaseResult {
  value: T;
}

export const TargetSchema = z.object({
  upToMonth: MonthDateSchema,
  startedAt: MonthDateSchema,
  targetAmount: MoneySchema,
  collectedAmount: MoneySchema,
  amountAssignedEveryMonth: MoneySchema,
  optimistic: z.boolean().optional(),
});

export type Target = z.infer<typeof TargetSchema>;

export const AssignmentSchema = z.object({
  month: MonthDateSchema,
  assignedAmount: MoneySchema,
  actualAmount: MoneySchema,
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const AccountTypeSchema = z.enum(ACCOUNT_TYPES);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const MonthStringSchema = z
  .string()
  .regex(/^\d{1,2}$/)
  .refine(
    (val) => {
      const monthNumber = parseInt(val, 10);
      return monthNumber >= 1 && monthNumber <= 12;
    },
    {
      message: "Month must be a number between 1 and 12",
    },
  )
  .catch(DEFAULT_MONTH_STRING)
  .default(DEFAULT_MONTH_STRING);

export const YearStringSchema = z
  .string()
  .refine((val) => Number(val) >= 2024, {
    message: "Year must be at least 2024",
  })
  .catch(DEFAULT_YEAR_STRING)
  .default(DEFAULT_YEAR_STRING);

export const DatePeriodSchema = z
  .enum(DATE_PERIOD_OPTIONS)
  .catch(DEFAULT_PERIOD_OPTION)
  .default(DEFAULT_PERIOD_OPTION);

export const DateString = RequiredString.refine(
  (dateString) => isValidIsoDate(dateString),
  { message: "Transaction date is invalid." },
);

export const NameSchema = z
  .string()
  .min(1, "Please provide name.")
  .regex(/^[a-zA-Z0-9\s.-]{1,50}$/, "Invalid name.");

export const NameInputSchema = z.object({
  name: NameSchema,
});

export type TNameInputSchema = z.infer<typeof NameInputSchema>;

export const amountLiveValidation = (value: string) => {
  // Replace empty input with '0'
  if (value === "") {
    value = "0";
  }

  // Convert commas to dots for decimal input
  value = value.replace(/,/g, ".");

  // Remove any non-numeric characters except '.'
  value = value.replace(/[^\d.]/g, "");

  // Remove leading zeros before the whole number part
  value = value.replace(/^0+(?=\d)/, "");

  // Remove leading zero if it's the only digit before a decimal point
  value = value.replace(/(^|-)0+(\d+\.\d*)/, "$1$2");

  // Remove leading zero if it's the only digit
  value = value.replace(/^0+(?=\d)/, "");

  // Replace multiple dots with a single dot
  value = value.replace(/(\..*)\./g, "$1");

  // Limit decimal places to 2 digits if there is a decimal part
  const parts = value.split(".");
  if (parts.length > 1) {
    value = `${parts[0].slice(0, 9)}.${parts[1].slice(0, 2)}`; // Limit to 9 digits before decimal and 2 digits after
  } else {
    value = value.slice(0, 9); // Limit to 9 digits if there's no decimal part
  }

  return value;
};
