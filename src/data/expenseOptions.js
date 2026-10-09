// src/data/expenseOptions.js  (FE, BARU)
// Langkah 1: pilihan kategori dan metode uang keluar, mudah diubah
// Daftar kategori ini contoh, samakan dengan kebutuhan usaha dan backend nanti
export const KATEGORI_KELUAR = [
  "Pembelian Material",
  "Gaji & Upah",
  "Transportasi & BBM",
  "Peralatan",
  "Operasional",
  "Lainnya",
];

// Langkah 1.1: warna badge tiap kategori, kategori tak dikenal memakai abu-abu
export const WARNA_KATEGORI = {
  "Pembelian Material": "bg-soft text-primary",
  "Gaji & Upah": "bg-green-100 text-green-700",
  "Transportasi & BBM": "bg-yellow-100 text-yellow-700",
  Peralatan: "bg-accent text-white",
  Operasional: "bg-purple-100 text-purple-700",
  Lainnya: "bg-gray-100 text-gray-700",
};

// Langkah 1.2: metode pengeluaran, value dipakai di data, label untuk tampilan
export const METODE_KELUAR = [
  { value: "cash", label: "Tunai" },
  { value: "transfer_bank", label: "Transfer Bank" },
];

export const labelMetodeKeluar = (value) =>
  METODE_KELUAR.find((m) => m.value === value)?.label || value;