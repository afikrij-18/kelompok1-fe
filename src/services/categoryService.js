// src/services/categoryService.js
import { apiFetch } from "./api";

// GET /api/categories mengembalikan kategori tingkat atas,
// "children" di dalamnya berisi layanan (bukan subkategori), jadi tidak dipakai di sini
export async function getCategories() {
  const body = await apiFetch("/categories");
  return body.data.map((c) => ({
    id: c.id,
    nama: c.name,
  }));
}

// tambah kategori utama (parent_id null)
export async function createCategory(nama) {
  const body = await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name: nama.trim(), parent_id: null }),
  });
  return { id: body.data.id, nama: body.data.name };
}

// ubah nama kategori, backend mewajibkan name dan mengosongkan parent_id jika tidak dikirim
export async function updateCategory(id, nama) {
  const body = await apiFetch(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name: nama.trim(), parent_id: null }),
  });
  return { id: body.data.id, nama: body.data.name };
}

// hapus kategori, backend menolak (400) jika masih punya layanan atau subkategori
export function deleteCategory(id) {
  return apiFetch(`/categories/${id}`, { method: "DELETE" });
}