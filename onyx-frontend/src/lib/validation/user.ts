import { z } from "zod";
import {
  CurrencySchema,
  RequiredString,
  ResultSchema,
} from "@/lib/validation/base";

export const EmailSchema = z.object({
  email: RequiredString.email("Invalid email address"),
});

export type TEmailSchema = z.infer<typeof EmailSchema>;

export const UserSchema = z.object({
  id: RequiredString,
  username: RequiredString,
  email: RequiredString,
  currency: CurrencySchema,
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

export const LoginSchema = EmailSchema.extend({
  password: RequiredString,
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

export const ConfirmedPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password minimum length is 6 characters.")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character.",
      )
      .regex(/\d/, "Password must contain at least one digit."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const ForgotPasswordNewSchema = EmailSchema.extend({
  verificationCode: RequiredString,
}).and(ConfirmedPasswordSchema);

export type TForgotPasswordNewSchema = z.infer<typeof ForgotPasswordNewSchema>;

export const RegisterSchema = EmailSchema.extend({
  username: RequiredString.max(
    15,
    "Usernamne maximum length is 15 characters.",
  ),
  currency: RequiredString,
}).and(ConfirmedPasswordSchema);

export type TRegisterSchema = z.infer<typeof RegisterSchema>;

export const VerifySchema = EmailSchema.extend({
  verificationCode: RequiredString,
});

export type TVerifySchema = z.infer<typeof VerifySchema>;

export const EditEmailSchema = z
  .object({
    currentEmail: RequiredString.email(),
    newEmail: RequiredString.email(),
  })
  .refine(({ currentEmail, newEmail }) => currentEmail !== newEmail, {
    message: "Your new email is the same as the current one.",
    path: ["newEmail"],
  });

export type TEditEmailSchema = z.infer<typeof EditEmailSchema>;

const GoogleLoginSchema = UserSchema.extend({
  authorizationToken: TokenSchema,
});

export type TGoogleLoginSchema = z.infer<typeof GoogleLoginSchema>;

export const GoogleLoginResultSchema = ResultSchema.extend({
  value: GoogleLoginSchema,
});
