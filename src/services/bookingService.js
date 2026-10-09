// src/services/bookingService.js
// Langkah 2: semua pemanggilan API booking dikumpulkan di sini
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

// Langkah 2.1: ubah status. PUT backend wajib menerima seluruh data booking,
// jadi data yang ada dikirim ulang (termasuk address_id dan catatan) bersama status barunya
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

// Langkah 2.2: pelanggan unik beserta semua alamat yang pernah dipakai,
// dikumpulkan dari daftar booking karena belum ada endpoint pelanggan.
// Booking terbaru lebih dulu, jadi nama dan alamat yang terbaru ada di urutan pertama.
export async function getCustomers() {
  const daftar = await getBookings();
  const peta = new Map();

  daftar.forEach((b) => {
    if (!peta.has(b.telepon)) {
      peta.set(b.telepon, { nama: b.pelanggan, telepon: b.telepon, alamatList: [] });
    }
    const pelanggan = peta.get(b.telepon);
    if (b.alamatId && !pelanggan.alamatList.some((a) => a.id === b.alamatId)) {
      pelanggan.alamatList.push({
        id: b.alamatId,
        label: b.labelAlamat,
        alamat: b.alamat,
        catatan: b.catatanLokasi,
      });
    }
  });

  return [...peta.values()];
}