import { z } from "zod";
import {
  DatePeriodSchema,
  IsoDateSchema,
  MonthStringSchema,
  RequiredString,
  YearStringSchema,
} from "@/lib/validation/base";

export const SingleBudgetPageParamsSchema = z.object({
  month: MonthStringSchema,
  year: YearStringSchema,
  accDate: IsoDateSchema,
  accPeriod: DatePeriodSchema,
});

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
