import { z } from "zod";
import {
  DatePeriodSchema,
  DateString,
  MonthStringSchema,
  RequiredString,
  YearStringSchema,
} from "@/lib/validation/base";
import { DEFAULT_ISO_DATE } from "../constants/date";

export const SingleBudgetPageParamsSchema = z
  .object({
    month: MonthStringSchema,
    year: YearStringSchema,
    accDate: DateString.catch(DEFAULT_ISO_DATE).default(DEFAULT_ISO_DATE),
    accPeriod: DatePeriodSchema,
    tableSize: z.string().default("8").catch("8"),
    dateRangeStart: DateString.optional(),
    dateRangeEnd: DateString.optional(),
  })
  .refine(
    (params) =>
      params.accPeriod !== "range" ||
      (params.dateRangeStart && params.dateRangeEnd),
    { message: "no dateRangeStart and dateRangeEnd in search params" },
  );

export type SingleBudgetPageSearchParams = z.infer<
  typeof SingleBudgetPageParamsSchema
>;

export const JoinBudgetParamsSchema = z.object({
  token: RequiredString,
});

export type JoinBudgetPageSearchParams = z.infer<typeof JoinBudgetParamsSchema>;

export const LoginPageParamsSchema = z.object({
  redirect: z.string().optional(),
});
