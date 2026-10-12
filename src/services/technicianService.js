// src/services/technicianService.js
// Langkah 2: semua pemanggilan API teknisi dikumpulkan di sini
import { apiFetch } from "./api";
import { fromApi, toApi } from "./technicianMapper";

const PATH = "/technicians";

// ambil semua teknisi
export async function getTechnicians() {
  const body = await apiFetch(PATH);
  return body.data.map(fromApi);
}

// tambah teknisi, mengembalikan teknisi baru
export async function createTechnician(form) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

// ubah teknisi
export async function updateTechnician(id, form) {
  const body = await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

// hapus teknisi
export function deleteTechnician(id) {
  return apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}