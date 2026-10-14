// src/services/publicService.js
// Langkah 3: pemanggilan API untuk halaman pelanggan (tanpa login)
import { apiFetch } from "./api";
import { fromApi as layananDariApi } from "./serviceMapper";
import { fromApi as bookingDariApi, toApi as bookingKeApi } from "./bookingMapper";

// TODO: samakan dengan route publik di backend
const PUBLIK = "/public";

// Langkah 3.1: daftar layanan untuk homepage dan form pelanggan
// bentuk data sama dengan layanan di admin (nama, harga, deskripsi, kategori)
export async function getPublicServices() {
  const body = await apiFetch(`${PUBLIK}/services`, { publik: true });
  return body.data.map(layananDariApi);
}

// Langkah 3.2: pelanggan membuat booking sendiri
// teknisi dan status tidak dikirim, backend menetapkan status Menunggu
export async function createPublicBooking(payload) {
  // eslint-disable-next-line no-unused-vars
  const { technician_id, ...isi } = bookingKeApi(payload);

  const body = await apiFetch(`${PUBLIK}/bookings`, {
    method: "POST",
    body: JSON.stringify(isi),
    publik: true,
  });

  // TODO: sesuaikan jika backend menamai nomor registrasi dengan nama lain
  return { kode: body.data.reg_no };
}

// Langkah 3.3: cek status booking dengan nomor registrasi + nomor HP pemesan
// TODO: samakan nama parameter dan bentuk respons dengan backend
export async function cekStatusBooking({ kode, telepon }) {
  const query = new URLSearchParams({ reg_no: kode, phone: telepon });
  const body = await apiFetch(`${PUBLIK}/bookings/status?${query}`, { publik: true });

  const b = bookingDariApi(body.data);
  return {
    ...b,
    lunas: b.paid ?? Boolean(body.data.is_paid ?? body.data.paid ?? false),
    // nama teknisi hanya tampil jika backend mengirimnya
    teknisi: body.data.technician?.name || body.data.technician_name || "",
  };
}