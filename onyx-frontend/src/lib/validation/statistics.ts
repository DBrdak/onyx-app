import { z } from "zod";

import {
  MoneySchema,
  MonthDateSchema,
  RequiredString,
  ResultSchema,
} from "@/lib/validation/base";

const StatisticsMonthSchema = MonthDateSchema.extend({
  monthName: RequiredString,
});

export const StatisticsWithAssignedAmountSchema = z.object({
  month: StatisticsMonthSchema,
  spentAmount: MoneySchema,
  assignedAmount: MoneySchema,
});

export type TStatisticsWithAssignedAmountSchema = z.infer<
  typeof StatisticsWithAssignedAmountSchema
>;

export const StatisticsWithEarnedAmountSchema = z.object({
  month: StatisticsMonthSchema,
  spentAmount: MoneySchema,
  earnedAmount: MoneySchema,
});

export type TStatisticsWithEarnedAmountSchema = z.infer<
  typeof StatisticsWithEarnedAmountSchema
>;

const CategoriesStatisticsSchema = z.object({
  data: z.record(
    RequiredString,
    z.array(
      StatisticsWithAssignedAmountSchema.extend({
        subcategories: z.record(
          RequiredString,
          z.object({
            item1: MoneySchema,
            item2: MoneySchema,
          }),
        ),
      }),
    ),
  ),
});

export type TCategoriesStatisticsSchema = z.infer<
  typeof CategoriesStatisticsSchema
>;

const AccountsStatisticsSchema = z.object({
  data: z.record(RequiredString, z.array(StatisticsWithEarnedAmountSchema)),
});

export type TAccountsStatisticsSchema = z.infer<
  typeof AccountsStatisticsSchema
>;

const BudgetStatisticsSchema = z.object({
  monthlyData: z.array(StatisticsWithEarnedAmountSchema),
});

export type TBudgetStatisticsSchema = z.infer<typeof BudgetStatisticsSchema>;

const CounterpartiesStatisticsSchema = z.object({
  data: z.record(RequiredString, z.array(StatisticsWithEarnedAmountSchema)),
});

export type TCounterpartiesStatisticsSchema = z.infer<
  typeof CounterpartiesStatisticsSchema
>;

const SubcategoriesStatisticsSchema = z.object({
  data: z.record(RequiredString, z.array(StatisticsWithAssignedAmountSchema)),
});

export type TSubcategoriesStatisticsSchema = z.infer<
  typeof SubcategoriesStatisticsSchema
>;

const StatisticsValueSchema = z.object({
  categories: CategoriesStatisticsSchema,
  accounts: AccountsStatisticsSchema,
  budget: BudgetStatisticsSchema,
  counterparties: CounterpartiesStatisticsSchema,
  subcategories: SubcategoriesStatisticsSchema,
});

export type TStatisticsValueSchema = z.infer<typeof StatisticsValueSchema>;

export const StatisticsSchemaResult = ResultSchema.extend({
  value: StatisticsValueSchema,
});
