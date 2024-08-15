import axios from "axios";

const ID_URL =
  "https://yu9x65iv7d.execute-api.eu-central-1.amazonaws.com/api/v1";
const USER_URL =
  "https://yu9x65iv7d.execute-api.eu-central-1.amazonaws.com/api/v1";
const BUDGET_URL =
  "https://dmmk6wjyfg.execute-api.eu-central-1.amazonaws.com/api/v1";

export const identityApi = axios.create({
  baseURL: ID_URL,
});

export const userApi = axios.create({
  baseURL: USER_URL,
});

export const budgetApi = axios.create({
  baseURL: BUDGET_URL,
});
