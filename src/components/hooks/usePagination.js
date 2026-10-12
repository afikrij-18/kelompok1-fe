// src/hooks/usePagination.js
// Langkah 1: pagination sisi frontend untuk data yang sudah dimuat

// items    = data yang sudah difilter
// perPage  = jumlah baris per halaman
// resetKey = teks yang berubah saat cari atau filter berubah, supaya kembali ke halaman 1
import { useEffect, useState } from "react";

export default function usePagination(items, perPage = 10, resetKey = "") {
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    setHalaman(1);
  }, [resetKey]);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  // Langkah 1.1: jaga agar halaman tidak melewati batas, mis. setelah menghapus data terakhir di halaman itu
  const page = Math.min(halaman, totalPages);
  const mulai = (page - 1) * perPage;

  return {
    page,
    setPage: setHalaman,
    totalPages,
    total,
    perPage,
    mulai, // dipakai untuk nomor urut: mulai + i + 1
    pageItems: items.slice(mulai, mulai + perPage),
  };
}