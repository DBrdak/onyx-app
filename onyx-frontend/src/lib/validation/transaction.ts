import * as z from "zod";

import { SubcategorySchema } from "@/lib/validation/subcategory";
import {
  CurrencySchema,
  DateString,
  MoneySchema,
  RequiredString,
  ResultSchema,
} from "@/lib/validation/base";
import { CounterpartySchema } from "@/lib/validation/counterparty";
import { AccountSchema } from "@/lib/validation/account";
import { ALL_CURRENCIES } from "@/lib/constants/currency";
import { isInPastRange } from "../utils";

export const TransactionSchema = z.object({
  id: RequiredString,
  subcategory: SubcategorySchema.nullable(),
  amount: MoneySchema,
  originalAmount: MoneySchema.optional(),
  account: AccountSchema,
  counterparty: CounterpartySchema,
  optimistic: z.boolean().optional(),
});

export const TransactionReceivedSchema = TransactionSchema.extend({
  transactedAt: DateString.transform((dateString) => new Date(dateString)),
});

export type Transaction = z.infer<typeof TransactionReceivedSchema>;

export const TransactionResultSchema = ResultSchema.extend({
  value: z.array(TransactionReceivedSchema),
});

const AmountSchema = RequiredString.regex(
  /^-?\d+([.,]\d{1,2})?$/,
  "Invalid amount",
)
  .transform((v) => v.replace(",", "."))
  .refine((v) => parseFloat(v) !== 0, {
    message: "Amount cannot be 0.",
  });

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
    currency: CurrencySchema,
    amount: AmountSchema,
    transactedAt: z.date(),
  })
  .and(CreateTransactionSubcategoryIdSchema);

export type TCreateTransactionSchema = z.infer<typeof CreateTransactionSchema>;

export const ImportTransactionsSelectStageSchema = z.object({
  date: DateString,
  counterparty: RequiredString,
  currency: z.enum(ALL_CURRENCIES),
  amount: AmountSchema,
});

export const ImportTransactionsSelectStageArraySchema = z.array(
  ImportTransactionsSelectStageSchema,
);

export type TImportTransactionsSelectStage = z.infer<
  typeof ImportTransactionsSelectStageSchema
>;

export const ImportTransactionsSubmitStageSchema = z
  .object({
    amount: MoneySchema,
    transactedAt: DateString.transform(
      (dateString) => new Date(dateString),
    ).refine((dateString) => isInPastRange(dateString, 5), {
      message: "Transaction date cannot be older than 5 years.",
    }),
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
