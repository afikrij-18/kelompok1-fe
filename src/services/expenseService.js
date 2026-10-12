// src/services/expenseService.js  (FE, BARU)
// Langkah 4: pengambilan dan penyimpanan data uang keluar
// Sekarang memakai data dummy di memori (hilang saat halaman di-refresh).
// Setelah endpoint ada, ganti isi tiap fungsi dengan apiFetch dari "./api",
// alamat endpoint jangan ditebak, cek routes dan controller uang keluar di backend
import { expensesDummy } from "../data/expenseDummy";
import { fromApi, toApi } from "./expenseMapper";

// Langkah 4.1: salinan data supaya bisa diubah selama aplikasi terbuka
let data = expensesDummy.map(fromApi);

const jeda = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// terbaru di atas: tanggal terbaru dulu, tanggal sama diurutkan dari id terbesar
const urutkan = (list) => [...list].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);

// Langkah 4.2: ambil semua uang keluar
export async function getExpenses() {
  await jeda(400);
  return urutkan(data);
}

// Langkah 4.3: tambah, mengembalikan data yang baru dibuat
export async function createExpense(form) {
  await jeda(300);
  const idBaru = data.length ? Math.max(...data.map((e) => e.id)) + 1 : 1;
  const baru = fromApi({ ...toApi(form), id: idBaru });
  data = [baru, ...data];
  return baru;
}

// Langkah 4.4: ubah
export async function updateExpense(id, form) {
  await jeda(300);
  const diubah = fromApi({ ...toApi(form), id });
  data = data.map((e) => (e.id === id ? diubah : e));
  return diubah;
}

// Langkah 4.5: hapus
export async function deleteExpense(id) {
  await jeda(300);
  data = data.filter((e) => e.id !== id);
}