// src/hooks/useLayananPublik.js
// Langkah 3: layanan dari API untuk homepage, dikelompokkan per kategori
import { useEffect, useState } from "react";
import { getPublicServices } from "../../services/publicService";

export default function useLayananPublik() {
  const [layanan, setLayanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let batal = false; // cegah set state jika halaman sudah ditinggalkan

    getPublicServices()
      .then((data) => {
        if (!batal) setLayanan(data);
      })
      .catch((err) => {
        if (!batal) {
          setError(
            err instanceof TypeError
              ? "Tidak dapat terhubung ke server. Coba muat ulang halaman."
              : "Daftar layanan belum dapat dimuat saat ini."
          );
        }
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, []);

  // Langkah 3.1: kelompokkan per kategori, urutan kategori mengikuti kemunculan pertama
  const peta = new Map();
  layanan.forEach((l) => {
    if (!peta.has(l.categoryId)) peta.set(l.categoryId, { id: l.categoryId, nama: l.kategori, layanan: [] });
    peta.get(l.categoryId).layanan.push(l);
  });

  return { layanan, perKategori: [...peta.values()], loading, error };
}