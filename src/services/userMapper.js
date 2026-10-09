// src/services/userMapper.js
// Langkah 1: terjemahan nama field backend <-> frontend (sesuai models/User.js)

// Langkah 1.1: role di database hanya admin dan owner (teknisi sudah tabel sendiri)
const ROLE_DARI_API = { admin: "Admin", owner: "Owner" };
const ROLE_KE_API = { Admin: "admin", Owner: "owner" };

// backend -> tampilan, role yang tidak dikenal menjadi "" supaya form meminta memilih ulang
export const fromApi = (u) => ({
  id: u.id,
  nama: u.name,
  email: u.email,
  telepon: u.phone || "", // phone di database boleh null
  role: ROLE_DARI_API[u.role] || "",
  status: u.status === "active" ? "Aktif" : "Nonaktif",
});

// tampilan -> backend, untuk TAMBAH user (password ikut dikirim)
export const toCreateApi = (u) => ({
  name: u.nama.trim(),
  email: u.email.trim(),
  password: u.password,
  // string kosong ditolak validator backend, jadi kirim null
  phone: u.telepon ? u.telepon : null,
  role: ROLE_KE_API[u.role],
  status: u.status === "Aktif" ? "active" : "inactive",
});

// tampilan -> backend, untuk UBAH user (tanpa password, kalau ada backend menolak)
export const toUpdateApi = (u) => ({
  name: u.nama.trim(),
  email: u.email.trim(),
  phone: u.telepon ? u.telepon : null,
  role: ROLE_KE_API[u.role],
  status: u.status === "Aktif" ? "active" : "inactive",
});