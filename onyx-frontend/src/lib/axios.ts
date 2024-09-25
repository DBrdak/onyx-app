import axios from "axios";

const ID_URL = "https://identity.onyxapp.tech/api/v1";
const USER_URL = "https://identity.onyxapp.tech/api/v1";
const BUDGET_URL = "https://budget.onyxapp.tech/api/v1";

export const identityApi = axios.create({
  baseURL: ID_URL,
});

export const userApi = axios.create({
  baseURL: USER_URL,
});

export const budgetApi = axios.create({
  baseURL: BUDGET_URL,
});
