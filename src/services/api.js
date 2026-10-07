// src/services/api.js
// Tambahan: error membawa status dan daftar errors dari backend
import { getToken, logout } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  // token kedaluwarsa atau tidak valid -> bersihkan sesi, kembali ke login
  if (res.status === 401) {
    logout();
    window.location.href = "/login";
    throw new Error("Sesi berakhir, silakan login lagi");
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.message || "Terjadi kesalahan");
    err.status = res.status;
    // daftar { field, message } dari validasi Sequelize (status 400)
    err.errors = body.errors;
    throw err;
  }

  return body;
}