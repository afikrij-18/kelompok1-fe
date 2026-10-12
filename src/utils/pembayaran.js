// src/utils/pembayaran.js
// Langkah 1: logika pembayaran booking, dipakai Detail, Edit, dan cetak invoice

// Langkah 1.1: pilihan bank untuk pembayaran via transfer
export const BANK_OPSI = ["BCA", "Mandiri", "BNI", "BRI"];

// Langkah 1.2: catatan transaksi, untuk transfer ditambah nama bank
// "Transfer BCA - ref 12345", atau "Transfer BCA" jika catatan kosong
export const susunCatatanBayar = ({ metode, bank, catatan }) => {
  const c = (catatan || "").trim();
  if (metode === "transfer_bank") return c ? `Transfer ${bank} - ${c}` : `Transfer ${bank}`;
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