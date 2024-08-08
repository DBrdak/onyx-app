import axios from "axios";

const ID_URL =
  "https://yu9x65iv7d.execute-api.eu-central-1.amazonaws.com/api/v1";
const BUDGET_URL =
  "https://vda327ao6h.execute-api.eu-central-1.amazonaws.com/api/v1";

export const identityApi = axios.create({
  baseURL: ID_URL,
});

export const budgetApi = axios.create({
  baseURL: BUDGET_URL,
});
