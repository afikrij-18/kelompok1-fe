// src/services/expenseService.js (BARU)
import { apiFetch } from "./api";
import { fromApi } from "./expenseMapper";

// TODO: samakan dengan route uang keluar di backend
const PATH = "/expenses";

export async function getExpenses() {
  const body = await apiFetch(PATH);
  return body.data.map(fromApi);
}