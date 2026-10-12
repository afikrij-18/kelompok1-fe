// src/services/bookingService.js
// Langkah 2: semua pemanggilan API booking dikumpulkan di sini
import { apiFetch } from "./api";
import { fromApi, toApi, statusKeApi } from "./bookingMapper";

const PATH = "/bookings";

// Langkah 2.1: GET /bookings belum menyertakan transaksi, jadi digabung dari GET /transactions.
// Kalau backend nanti menyertakan transactions di booking, yang dari backend yang dipakai.
const ambilTransaksiMentah = async () => (await apiFetch("/transactions")).data || [];

const gabungTransaksi = (mentah, semuaTransaksi) => ({
  ...mentah,
  transactions: mentah.transactions ?? semuaTransaksi.filter((t) => t.booking_id === mentah.id),
});

export async function getBookings() {
  const [body, transaksi] = await Promise.all([apiFetch(PATH), ambilTransaksiMentah()]);
  return body.data.map((b) => fromApi(gabungTransaksi(b, transaksi)));
}

export async function getBookingById(id) {
  const [body, transaksi] = await Promise.all([apiFetch(`${PATH}/${id}`), ambilTransaksiMentah()]);
  return fromApi(gabungTransaksi(body.data, transaksi));
}

// booking baru belum punya transaksi, jadi respons POST langsung dipakai
export async function createBooking(payload) {
  const body = await apiFetch(PATH, {
    method: "POST",
    body: JSON.stringify(toApi(payload)),
  });
  return fromApi(body.data);
}

// Langkah 2.2: respons PUT tidak membawa transaksi, jadi hasilnya diambil ulang agar status pembayaran tidak hilang
export async function updateBooking(id, payload) {
  await apiFetch(`${PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApi(payload)),
  });
  return getBookingById(id);
}

// ubah status. PUT backend wajib menerima seluruh data booking,
// jadi data yang ada dikirim ulang (termasuk address_id, catatan, dan teknisi) bersama status barunya
export async function updateBookingStatus(booking, statusLabel) {
  await apiFetch(`${PATH}/${booking.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...toApi(booking), status: statusKeApi(statusLabel) }),
  });
  return getBookingById(booking.id);
}

// hapus booking beserta unitnya (hapus permanen di backend)
export function deleteBooking(id) {
  return apiFetch(`${PATH}/${id}`, { method: "DELETE" });
}

// Langkah 2.3: pelanggan unik beserta semua alamat yang pernah dipakai,
// dikumpulkan dari daftar booking karena belum ada endpoint pelanggan.
// Booking terbaru lebih dulu, jadi nama dan alamat yang terbaru ada di urutan pertama.
export async function getCustomers() {
  const body = await apiFetch(PATH);
  const peta = new Map();

  body.data.map(fromApi).forEach((b) => {
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