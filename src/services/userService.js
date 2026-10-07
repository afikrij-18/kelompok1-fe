// src/services/userService.js
// updateUser sekarang hanya mengubah data diri, password lewat updateUserPassword
import { apiFetch } from "./api";
import { fromApi, toCreateApi, toUpdateApi } from "./userMapper";

const PATH = "/users";

// ambil semua user
export async function getUsers() {
  const body = await apiFetch(PATH);
  return body.data.map(fromApi);
}

// tambah user, mengembalikan user baru
export async function createUser(form) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toCreateApi(form)),
  });
  return fromApi(body.data);
}

// ubah data user (tanpa password, kalau ada backend menolak)
export async function updateUser(id, form) {
  const body = await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toUpdateApi(form)),
  });
  return fromApi(body.data);
}

// ganti password user, endpoint terpisah dari ubah data
export function updateUserPassword(id, newPassword) {
  return apiFetch(`${PATH}/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });
}

// hapus user (hapus permanen di backend)
export function deleteUser(id) {
  return apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}