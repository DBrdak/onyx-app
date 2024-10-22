import { identityApi, userApi } from "@/lib/axios";
import {
  Token,
  TokenResultSchema,
  User,
  UserResultSchema,
} from "@/lib/validation/user";
import { validateResponse } from "@/lib/utils";

export interface EmailVerificationPayload {
  email: string;
  verificationCode: string;
}

export interface ForgotPasswordNewPayload extends EmailVerificationPayload {
  newPassword: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  currency: string;
}

export type VerifyPayload = EmailVerificationPayload;

export const refreshAccessToken = async (longLivedToken: string) => {
  const response = await identityApi.put("/auth/refresh", { longLivedToken });
  return validateResponse<Token>(TokenResultSchema, response.data);
};

export const getAuthInitializationData = async (longLivedToken: string) => {
  const { accessToken, longLivedToken: newLongLivedToken } =
    await refreshAccessToken(longLivedToken);

  if (!accessToken || !newLongLivedToken) {
    throw new Error("Initialize app refresh token api error");
  }

  const user = await getUser(accessToken);

  if (!user) {
    throw new Error("Initialize app get user data error");
  }

  return { accessToken, longLivedToken: newLongLivedToken, user };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await identityApi.post("/auth/login", {
    email,
    password,
  });

  return validateResponse<Token>(TokenResultSchema, response.data);
};

export const getUser = async (accessToken: string) => {
  const response = await userApi.get("/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return validateResponse<User>(UserResultSchema, response.data);
};

export const forgotPasswordRequest = (email: string): Promise<void> =>
  identityApi.put("/auth/forgot-password/request", { email });

export const forgotPasswordNew = (
  payload: ForgotPasswordNewPayload,
): Promise<void> => identityApi.put("/auth/forgot-password/new", payload);

export const register = (payload: RegisterPayload): Promise<void> =>
  identityApi.post("/auth/register", payload);

export const verifyEmail = (payload: VerifyPayload): Promise<void> =>
  identityApi.put("/auth/verify-email", payload);

export const forgotVerify = (email: string): Promise<void> =>
  identityApi.put("/auth/resend-email", {
    email,
    messageType: "EmailVerification",
  });
