import * as z from "zod";
import { parse, isValid } from "date-fns";

import { SubcategorySchema } from "@/lib/validation/subcategory";
import {
  MoneySchema,
  RequiredString,
  ResultSchema,
} from "@/lib/validation/base";
import { CounterpartySchema } from "@/lib/validation/counterparty";
import { AccountSchema } from "@/lib/validation/account";
import { ALL_CURRENCIES } from "@/lib/constants/currency";

export const TransactionSchema = z.object({
  id: RequiredString,
  subcategory: SubcategorySchema.nullable(),
  amount: MoneySchema,
  originalAmount: MoneySchema.optional(),
  account: AccountSchema,
  counterparty: CounterpartySchema,
  transactedAt: RequiredString,
  optimistic: z.boolean().optional(),
});
export type Transaction = z.infer<typeof TransactionSchema>;
export const TransactionResultSchema = ResultSchema.extend({
  value: z.array(TransactionSchema),
});

const AmountSchema = RequiredString.regex(
  /^-?\d+([.,]\d{1,2})?$/,
  "Invalid amount",
)
  .transform((v) => v.replace(",", "."))
  .refine((v) => parseFloat(v) !== 0, {
    message: "Amount cannot be 0.",
  });

const DateSchema = RequiredString.refine(
  (dateString) => {
    let parsedDate = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());

    if (!isValid(parsedDate)) {
      parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    }

    return isValid(parsedDate);
  },
  {
    message: "Invalid date. Use YYYY-MM-DD or YYYY-MM-DD HH:mm:ss format.",
  },
);

const CreateTransactionSubcategoryIdSchema = z
  .object({
    transactionSign: z.enum(["+", "-"]),
    subcategoryId: z.string().optional(),
    subcategoryName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.transactionSign === "-" && !data.subcategoryId) {
        return false;
      }
      return true;
    },
    {
      message: "Required.",
      path: ["subcategoryId"],
    },
  );

export const CreateTransactionSchema = z
  .object({
    counterpartyName: RequiredString.max(
      50,
      "Max length of counterparty name is 50 characters.",
    ),
    currency: RequiredString,
    amount: AmountSchema,
    transactedAt: z.date(),
  })
  .and(CreateTransactionSubcategoryIdSchema);

export type TCreateTransactionSchema = z.infer<typeof CreateTransactionSchema>;

export const ImportTransactionsSelectStageSchema = z.object({
  date: DateSchema,
  counterparty: RequiredString,
  currency: RequiredString,
  amount: AmountSchema,
});

export const ImportTransactionsSelectStageArraySchema = z.array(
  ImportTransactionsSelectStageSchema,
);

export type TImportTransactionsSelectStage = z.infer<
  typeof ImportTransactionsSelectStageSchema
>;

const AmountWithValidatedCurrency = z.object({
  amount: z.number(),
  currency: z.enum(ALL_CURRENCIES),
});

export const ImportTransactionsSubmitStageSchema = z
  .object({
    accountId: RequiredString,
    amount: AmountWithValidatedCurrency,
    transactedAt: DateSchema,
    counterpartyName: RequiredString,
    subcategoryId: RequiredString.nullable(),
  })
  .refine(
    (data) => {
      const amount = data.amount.amount;
      return amount >= 0 || (amount < 0 && data.subcategoryId !== null);
    },
    {
      message: "Subcategory is required for negative amounts.",
    },
  );

export type ImportTransactionsPresubmitState = z.infer<
  typeof ImportTransactionsSubmitStageSchema
> & { subcategoryName: string | null };

export const ImportTransactionsSubmitStageArraySchema = z.array(
  ImportTransactionsSubmitStageSchema,
);
