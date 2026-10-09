// src/data/bookingOptions.js 
// teks dan pilihan di satu tempat, mudah diubah
// PENGINGAT: biaya kunjungan, garansi, dan teks pembayaran masih nilai contoh dari desain Stitch,
// cek ke PRD atau tim sebelum aplikasi dipakai sungguhan
export const MAKS_UNIT = 5;

export const TAMPILKAN_BIAYA_KUNJUNGAN = true;
export const BIAYA_KUNJUNGAN = 0; // 0 = tampil "GRATIS"
export const GARANSI_HARI = 30; // null = tidak tampil
export const INFO_PEMBAYARAN = "Bayar di tempat setelah pengerjaan selesai dicek."; // kosong = tidak tampil
export const CATATAN_HARGA =
  "* Harga akhir dapat disesuaikan berdasarkan hasil pengecekan teknisi di lokasi sebelum pengerjaan dimulai."; // kosong = tidak tampil

export const JAMINAN = [
  "Teknisi bersertifikat dengan perlengkapan kerja rapi dan bersih.",
  `Garansi pengerjaan ${GARANSI_HARI} hari kalender.`,
  "Harga transparan sebelum pengerjaan dimulai.",
]; // array kosong = kartu "Jaminan Layanan" tidak tampil

export const MEREK = ["Daikin", "Panasonic", "Sharp", "LG", "Samsung", "Midea", "Gree", "Lainnya"];
export const KAPASITAS = ["0.5 PK", "0.75 PK", "1 PK", "1.5 PK", "2 PK", "2.5 PK"];
export const TIPE = ["Split Wall", "Cassette", "Floor Standing", "Portable"];
export const SLOT_JAM = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

// Metode pembayaran di langkah Review. value disimpan di state, label tampil di UI.
export const METODE_PEMBAYARAN = [
  { value: "tunai", label: "Tunai" },
  { value: "transfer", label: "Transfer Bank" },
];

// Bank tujuan, tampil hanya jika metode = transfer.
export const BANK_OPTIONS = [
  { value: "bca", nama: "BCA", rekening: "8210 4567 89 a.n. ServisAC" },
  { value: "mandiri", nama: "Mandiri", rekening: "8900 1234 5678 a.n. ServisAC" },
  { value: "bni", nama: "BNI", rekening: "1234 5678 90 a.n. ServisAC" },
  { value: "bri", nama: "BRI", rekening: "0021 0100 3456 78 a.n. ServisAC" },
];