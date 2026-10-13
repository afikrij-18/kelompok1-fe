// src/services/bankService.js — CRUD master bank (GET /banks)
import { apiFetch } from "./api";

const PATH = "/banks";

const pesanDefault = (b) => ({
  id: b.id,
  nama: b.nama,
  noRekening: b.no_rekening || "",
  atasNama: b.atas_nama || "",
  status: b.status,
  jumlahTransaksi: Number(b.jumlah_transaksi || 0),
});

// GET /banks?search=&status= — status "" = semua (untuk halaman Pengaturan)
export async function getBanks(status = "active", search = "") {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  if (search.trim()) q.set("search", search.trim());
  const qs = q.toString();
  const body = await apiFetch(`${PATH}${qs ? `?${qs}` : ""}`);
  return (body.data || []).map(pesanDefault);
}

export async function createBank({ nama, noRekening, atasNama }) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify({
      nama: nama.trim(),
      no_rekening: noRekening?.trim() || null,
      atas_nama: atasNama?.trim() || null,
    }),
  });
  return pesanDefault(body.data);
}

export async function updateBank(id, { nama, noRekening, atasNama, status }) {
  const payload = {};
  if (nama !== undefined) payload.nama = nama.trim();
  if (noRekening !== undefined) payload.no_rekening = noRekening?.trim() || null;
  if (atasNama !== undefined) payload.atas_nama = atasNama?.trim() || null;
  if (status !== undefined) payload.status = status;
  const body = await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return pesanDefault(body.data);
}

export async function deleteBank(id) {
  await apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}

export async function fetchActiveBanks() {
  return getBanks("active");
}
