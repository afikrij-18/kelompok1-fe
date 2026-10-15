// src/services/expenseService.js
import { apiFetch } from "./api";
import { fromApi, toApi } from "./expenseMapper";

const PATH = "/expenses";
const CATEGORY_PATH = "/expense-categories";
const BANK_PATH = "/banks";

export async function getExpenses() {
  const body = await apiFetch(PATH);
  return (body.data || []).map(fromApi);
}

// GET /expense-categories?status=active — untuk dropdown kategori
export async function getExpenseCategories(status = "active", search = "") {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  if (search.trim()) q.set("search", search.trim());
  const qs = q.toString();
  const body = await apiFetch(`${CATEGORY_PATH}${qs ? `?${qs}` : ""}`);
  return (body.data || []).map((c) => ({
    id: c.id,
    nama: c.nama,
    deskripsi: c.deskripsi || "",
    status: c.status,
    jumlahTransaksi: Number(c.jumlah_transaksi || 0),
  }));
}

export async function createExpenseCategory({ nama, deskripsi }) {
  const body = await apiFetch(CATEGORY_PATH, {
    method: "POST",
    body: JSON.stringify({ nama: nama.trim(), deskripsi: deskripsi?.trim() || null }),
  });
  return body.data;
}

export async function updateExpenseCategory(id, { nama, deskripsi, status }) {
  const payload = {};
  if (nama !== undefined) payload.nama = nama.trim();
  if (deskripsi !== undefined) payload.deskripsi = deskripsi?.trim() || null;
  if (status !== undefined) payload.status = status;
  const body = await apiFetch(`${CATEGORY_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return body.data;
}

export async function deleteExpenseCategory(id) {
  await apiFetch(`${CATEGORY_PATH}/${id}`, { method: "DELETE" });
}

// GET /banks?status=active — untuk dropdown bank (master tabel)
export async function getBanks(status = "active") {
  const q = status ? `?status=${status}` : "";
  const body = await apiFetch(`${BANK_PATH}${q}`);
  return (body.data || []).map((b) => ({
    id: b.id,
    nama: b.nama,
    noRekening: b.no_rekening || "",
    atasNama: b.atas_nama || "",
    status: b.status,
  }));
}

export async function createExpense(form) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

export async function updateExpense(id, form) {
  const body = await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

export async function deleteExpense(id) {
  await apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}
