// src/utils/pembayaran.js
// Langkah 1: logika pembayaran booking, dipakai Detail, Edit, dan cetak invoice

// Langkah 1.1: pilihan bank sekarang dari tabel master `banks` (GET /api/banks)
// BANK_OPSI kept sebagai fallback jika API gagal — jangan pakai untuk dropdown baru
export const BANK_OPSI = ["BCA", "Mandiri", "BNI", "BRI"];

// Langkah 1.2: catatan transaksi, untuk transfer ditambah nama bank
// "Transfer BCA - ref 12345", atau "Transfer BCA" jika catatan kosong
// bank bisa berupa string nama atau bankId yang di-resolve via banks
export const susunCatatanBayar = ({ metode, bank, bankId, catatan }, banks = []) => {
  const c = (catatan || "").trim();
  if (metode === "transfer_bank") {
    let namaBank = (bank || "").trim();
    if (!namaBank && bankId && banks.length) {
      const hit = banks.find((b) => String(b.id) === String(bankId));
      if (hit) namaBank = hit.nama;
    }
    if (!namaBank) namaBank = bankId ? String(bankId) : "-";
    return c ? `Transfer ${namaBank} - ${c}` : `Transfer ${namaBank}`;
  }
  return c;
};

// Langkah 1.3: transaksi milik satu booking dari seluruh daftar transaksi
export const transaksiUntukBooking = (semua, bookingId) =>
  semua.filter((t) => String(t.bookingId) === String(bookingId));

// Langkah 1.4: hitung pembayaran sebuah booking
// hanya transaksi berstatus "paid" yang dihitung (pending dan failed diabaikan)
// jumlah dibaca dari t.dibayar (bentuk transactionMapper) atau t.jumlah (bentuk bookingMapper)
// hasil: { dibayar, sisa, lebih, status: "Belum" | "Sebagian" | "Lunas" }
export const hitungPembayaran = (total, transaksi = []) => {
  const dibayar = transaksi
    .filter((t) => t.status === "paid")
    .reduce((jumlah, t) => jumlah + Number(t.dibayar ?? t.jumlah ?? 0), 0);

  let status = "Belum";
  if (dibayar > 0) status = dibayar >= total ? "Lunas" : "Sebagian";

  return {
    dibayar,
    sisa: Math.max(0, total - dibayar),
    lebih: Math.max(0, dibayar - total), // backend tidak menolak kelebihan bayar
    status,
  };
};