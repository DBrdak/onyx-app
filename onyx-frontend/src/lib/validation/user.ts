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

export const EmailSchema = z.object({
  email: RequiredString.email("Invalid email address"),
});

export type TEmailSchema = z.infer<typeof EmailSchema>;

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
