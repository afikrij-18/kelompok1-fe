// src/utils/pengeluaran.js  (FE, BARU)
// Langkah 5: fungsi bantu halaman Uang Keluar
import { toISO } from "./booking";

// "2026-10-08" -> "08 Okt 2026"
export const formatTanggalPendek = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Langkah 5.1: offset 0 = bulan ini, -1 = bulan lalu
// Hasil: tanggal pertama dan terakhir bulan itu, format YYYY-MM-DD
export const rentangBulan = (offset = 0) => {
  const sekarang = new Date();
  const awal = new Date(sekarang.getFullYear(), sekarang.getMonth() + offset, 1);
  const akhir = new Date(sekarang.getFullYear(), sekarang.getMonth() + offset + 1, 0);
  return { dari: toISO(awal), sampai: toISO(akhir) };
};

// "Oktober 2026"
export const namaBulan = (offset = 0) => {
  const sekarang = new Date();
  return new Date(sekarang.getFullYear(), sekarang.getMonth() + offset, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

// Langkah 5.2: ringkasan untuk kartu dan rekap per kategori
export const ringkasPengeluaran = (list) => {
  const total = list.reduce((jumlah, e) => jumlah + e.jumlah, 0);

  const peta = {};
  list.forEach((e) => {
    peta[e.kategori] = (peta[e.kategori] || 0) + e.jumlah;
  });

  const perKategori = Object.entries(peta)
    .map(([kategori, nilai]) => ({
      kategori,
      total: nilai,
      persen: total > 0 ? Math.round((nilai / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return { total, jumlah: list.length, perKategori, terbesar: perKategori[0] || null };
};