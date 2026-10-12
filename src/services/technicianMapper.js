// src/services/technicianMapper.js
// Langkah 1: terjemahan nama field backend <-> frontend (sesuai tabel technicians)

const STATUS_DARI_API = { active: "Aktif", inactive: "Nonaktif" };

// Langkah 1.1: backend -> tampilan
export const fromApi = (t) => ({
  id: t.id,
  nama: t.name,
  telepon: t.phone || "", // phone boleh kosong
  status: STATUS_DARI_API[t.status] || t.status,
});

// Langkah 1.2: tampilan -> backend, untuk tambah dan ubah (semua field dikirim)
export const toApi = (t) => ({
  name: t.nama.trim(),
  // string kosong bisa ditolak validator, jadi kirim null
  phone: t.telepon ? t.telepon : null,
  status: t.status === "Aktif" ? "active" : "inactive",
});