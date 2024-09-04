import { z } from "zod";
import {
  MonthStringSchema,
  RequiredString,
  YearStringSchema,
} from "@/lib/validation/base";

export const SingleBudgetPageParamsSchema = z.object({
  month: MonthStringSchema,
  year: YearStringSchema,
  accMonth: MonthStringSchema,
  accYear: YearStringSchema,
});

export type SingleBudgetPageSearchParams = z.infer<
  typeof SingleBudgetPageParamsSchema
>;

export const JoinBudgetParamsSchema = z.object({
  token: RequiredString,
  budgetId: RequiredString,
});

export type JoinBudgetPageSearchParams = z.infer<typeof JoinBudgetParamsSchema>;

export const LoginPageParamsSchema = z.object({
  redirect: z.string().optional(),
});
