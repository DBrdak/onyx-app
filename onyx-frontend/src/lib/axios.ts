import axios from "axios";

export const identityApi = axios.create({
  baseURL: import.meta.env.VITE_ID_URL,
});

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_ID_URL,
});

export const budgetApi = axios.create({
  baseURL: import.meta.env.VITE_BUDGET_URL,
});
