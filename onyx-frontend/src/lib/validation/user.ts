import { z } from "zod";
import { RequiredString, ResultSchema } from "@/lib/validation/base";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  currency: z.string(),
});

export const UserResultSchema = ResultSchema.extend({
  value: UserSchema,
});

export type User = z.infer<typeof UserSchema>;

export const TokenSchema = z.object({
  accessToken: RequiredString,
  longLivedToken: RequiredString,
});

export const TokenResultSchema = ResultSchema.extend({
  value: TokenSchema,
});

export type Token = z.infer<typeof TokenSchema>;
export type TokenResult = z.infer<typeof TokenResultSchema>;

export const BudgetMemberSchema = UserSchema.omit({ currency: true });
export type BudgetMember = z.infer<typeof BudgetMemberSchema>;
