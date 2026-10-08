// src/services/bookingService.js
// Langkah 3: semua pemanggilan API booking dikumpulkan di sini
import { apiFetch } from "./api";
import { fromApi, toApi, statusKeApi } from "./bookingMapper";

const PATH = "/bookings";

export async function getBookings() {
  const body = await apiFetch(PATH);
  return body.data.map(fromApi);
}

export async function createBooking(payload) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toApi(payload)),
  });
  return fromApi(body.data);
}

// ubah status: PUT backend wajib menerima seluruh data booking,
// jadi data yang sudah ada dikirim ulang bersama status barunya
export async function updateBookingStatus(booking, statusLabel) {
  const body = await apiFetch(`${PATH}/${booking.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...toApi(booking), status: statusKeApi(statusLabel) }),
  });
  return fromApi(body.data);
}

// hapus booking beserta unitnya (hapus permanen di backend)
export function deleteBooking(id) {
  return apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}

// pelanggan unik dari daftar booking (booking terbaru lebih dulu, jadi datanya yang terbaru),
// dipakai untuk peringatan di form booking karena belum ada endpoint pelanggan
export async function getCustomers() {
  const daftar = await getBookings();
  const peta = new Map();
  daftar.forEach((b) => {
    if (!peta.has(b.telepon)) {
      peta.set(b.telepon, { nama: b.pelanggan, telepon: b.telepon, alamat: b.alamat });
    }
  });
  return [...peta.values()];
}