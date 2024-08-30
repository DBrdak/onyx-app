import axios from "axios";

const ID_URL =
  "https://f2tl69hlj1.execute-api.eu-central-1.amazonaws.com/dev/api/v1";
const USER_URL =
  "https://f2tl69hlj1.execute-api.eu-central-1.amazonaws.com/dev/api/v1";
const BUDGET_URL =
  "https://3ytwgrzbji.execute-api.eu-central-1.amazonaws.com/dev/api/v1";

export const identityApi = axios.create({
  baseURL: ID_URL,
});

export const userApi = axios.create({
  baseURL: USER_URL,
});

export const budgetApi = axios.create({
  baseURL: BUDGET_URL,
});
