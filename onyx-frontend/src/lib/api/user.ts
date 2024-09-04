import { identityApi, userApi } from "@/lib/axios";
import {
  Token,
  TokenResultSchema,
  User,
  UserResultSchema,
} from "@/lib/validation/user";
import { validateResponse } from "@/lib/utils";

export const refreshAccessToken = async (longLivedToken: string) => {
  const response = await identityApi.put("/auth/refresh", { longLivedToken });
  const validatedData = TokenResultSchema.parse(response.data);
  return validatedData.value;
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

export const getUser = async () => {
  const response = await userApi.get("/user");
  return validateResponse<User>(UserResultSchema, response.data);
};
