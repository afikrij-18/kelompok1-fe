// src/services/api.js
// Langkah 1: opsi abaikan401 (401 bukan berarti sesi berakhir) dan publik (tanpa token, untuk halaman pelanggan)
import { getToken, logout } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

// pesan cadangan kalau backend tidak mengirim "message" (mis. 404 bawaan Express)
const pesanDefault = (status) =>
  status === 404
    ? "Alamat API tidak ditemukan (404). Pastikan endpoint sudah dibuat di backend."
    : "Terjadi kesalahan";

export async function apiFetch(path, options = {}) {
  // Langkah 1.1: publik = pengunjung tanpa login, jangan kirim token dan jangan arahkan ke /login
  const { abaikan401, publik, ...opsiFetch } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...opsiFetch,
    headers: {
      "Content-Type": "application/json",
      ...(publik ? {} : { Authorization: `Bearer ${getToken()}` }),
      ...opsiFetch.headers,
    },
  });

  // token kedaluwarsa atau tidak valid -> bersihkan sesi, kembali ke login
  if (res.status === 401 && !abaikan401 && !publik) {
    logout();
    window.location.href = "/login";
    throw new Error("Sesi berakhir, silakan login lagi");
  }

  // body harus dibaca SEBELUM dipakai di bawah
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.message || pesanDefault(res.status));
    err.status = res.status;
    // daftar { field, message } dari validasi backend (status 400)
    err.errors = body.errors;
    throw err;
  }

  return body;
}