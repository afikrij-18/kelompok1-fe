// src/services/expenseMapper.js  (FE, BARU)
// Langkah 3: satu-satunya tempat nama field uang keluar backend <-> tampilan
// Bentuk data tampilan: { id, tanggal, kategori, keterangan, jumlah, metode, catatan }
// Endpoint belum ada, jadi nama field backend untuk sementara SAMA dengan tampilan.
// Setelah endpoint dan modelnya ada, ubah sisi kanan (e.xxx) di fromApi
// dan nama kunci di toApi sesuai backend, file lain tidak perlu diubah

// backend -> tampilan
export const fromApi = (e) => ({
  id: e.id,
  tanggal: e.tanggal,
  kategori: e.kategori,
  keterangan: e.keterangan,
  jumlah: Number(e.jumlah) || 0, // angka dari database bisa berupa teks
  metode: e.metode,
  catatan: e.catatan ?? "",
});

// tampilan -> backend
export const toApi = (e) => ({
  tanggal: e.tanggal,
  kategori: e.kategori,
  keterangan: e.keterangan.trim(),
  jumlah: Number(e.jumlah),
  metode: e.metode,
  catatan: e.catatan.trim(),
});