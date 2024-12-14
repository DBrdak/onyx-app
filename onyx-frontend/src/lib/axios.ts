import axios from "axios";

export const ID_URL =
  "https://13nq38cpog.execute-api.eu-central-1.amazonaws.com/api/v1";
export const USER_URL =
  "https://13nq38cpog.execute-api.eu-central-1.amazonaws.com/api/v1";
export const BUDGET_URL =
  "https://xcrqtrk0xg.execute-api.eu-central-1.amazonaws.com/api/v1";

export const identityApi = axios.create({
  baseURL: ID_URL,
});

export const userApi = axios.create({
  baseURL: USER_URL,
});

export const budgetApi = axios.create({
  baseURL: BUDGET_URL,
});
