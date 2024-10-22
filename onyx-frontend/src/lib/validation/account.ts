import { z } from "zod";
import {
  AccountTypeSchema,
  CurrencySchema,
  MoneySchema,
  NameSchema,
  RequiredString,
  ResultSchema,
} from "@/lib/validation/base";

export const AccountSchema = z.object({
  id: RequiredString,
  slug: RequiredString,
  name: RequiredString,
  balance: MoneySchema,
  type: AccountTypeSchema,
  optimistic: z.boolean().optional(),
});

export const AccountResultSchema = ResultSchema.extend({
  value: z.array(AccountSchema),
});
export const SingleAccountResultSchema = ResultSchema.extend({
  value: AccountSchema,
});

export type Account = z.infer<typeof AccountSchema>;

export const CreateAccountSchema = z.object({
  name: NameSchema,
  amount: RequiredString,
  currency: CurrencySchema,
  accountType: AccountTypeSchema,
});

export type TCreateAccountForm = z.infer<typeof CreateAccountSchema>;

export const EditAccountNameSchema = z.object({
  name: NameSchema,
});

export type TEditAccountSchema = z.infer<typeof EditAccountNameSchema>;
