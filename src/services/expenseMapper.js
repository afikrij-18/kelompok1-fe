// src/services/expenseMapper.js  (FE, BARU)
// Langkah 3: satu-satunya tempat nama field uang keluar backend <-> tampilan
// Bentuk data tampilan: { id, tanggal, kategori, keterangan, jumlah, metode, catatan }
// Endpoint belum ada, jadi nama field backend untuk sementara SAMA dengan tampilan.
// Setelah endpoint dan modelnya ada, ubah sisi kanan (e.xxx) di fromApi
// dan nama kunci di toApi sesuai backend, file lain tidak perlu diubah

// backend -> tampilan (dukung relasi bank_ref + fallback kolom teks lama)
export const fromApi = (e) => ({
  id: e.id,
  tanggal: e.tanggal,
  kategori: e.category?.nama || "Lainnya",
  kategoriId: e.category_id,
  keterangan: e.keterangan,
  jumlah: Number(e.jumlah) || 0, // angka dari database bisa berupa teks
  metode: e.metode,
  bank: e.bank_ref?.nama || e.bank || "",
  bankId: e.bank_id ?? e.bank_ref?.id ?? null,
});

// tampilan -> backend (kirim bank_id dinamis, tetap kirim bank teks sebagai fallback)
export const toApi = (e) => ({
  tanggal: e.tanggal,
  category_id: e.kategoriId,
  keterangan: e.keterangan.trim(),
  jumlah: Number(e.jumlah),
  metode: e.metode,
  bank_id: e.metode === "transfer_bank" ? (e.bankId || e.bank_id || null) : null,
  bank: e.metode === "transfer_bank" ? e.bank : null,
});