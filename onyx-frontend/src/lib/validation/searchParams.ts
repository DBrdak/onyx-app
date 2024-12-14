import { z } from "zod";
import { RequiredString } from "@/lib/validation/base";

export const JoinBudgetParamsSchema = z.object({
  token: RequiredString,
});

export type JoinBudgetPageSearchParams = z.infer<typeof JoinBudgetParamsSchema>;

export const LoginPageParamsSchema = z.object({
  redirect: z.string().optional(),
});

export const BudgetsPageParamsSchema = z.object({
  message: z.string().optional(),
});

export const GoogleAuthSchema = z.object({
  code: RequiredString,
});
