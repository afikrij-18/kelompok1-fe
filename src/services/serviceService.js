// src/services/serviceService.js
// semua pemanggilan API layanan dikumpulkan di sini
import { apiFetch } from "./api";
import { fromApi, toApi } from "./serviceMapper";

const PATH = "/services";

// ambil semua layanan
export async function getServices() {
  const body = await apiFetch(PATH);
  return body.data.map(fromApi);
}

// tambah layanan
export async function createService(form) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

// ubah layanan, semua field dikirim sekaligus
export async function updateService(id, form) {
  const body = await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApi(form)),
  });
  return fromApi(body.data);
}

// hapus layanan (hapus permanen di backend)
export async function deleteService(id) {
  try {
    await apiFetch(`${PATH}/${id}`, { method: "DELETE" });
  } catch (err) {
    // backend hanya membalas "Gagal menghapus service" untuk semua kegagalan
    // (termasuk layanan yang masih dipakai booking), jadi diberi petunjuk tambahan
    if (err.status === 500) {
      throw new Error(
        "Layanan tidak bisa dihapus. Kemungkinan sedang dipakai di data booking."
      );
    }
    throw err;
  }
}