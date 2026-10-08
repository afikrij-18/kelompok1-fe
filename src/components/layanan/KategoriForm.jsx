// src/components/layanan/KategoriForm.jsx
// satu dialog untuk dua mode (tambah dan edit)
import { useState } from "react";
import { X } from "lucide-react";

// Langkah 2.1: samakan huruf besar-kecil dan spasi ganda sebelum membandingkan nama
const normal = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

export default function KategoriForm({ initialData, existingKategori, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  const [nama, setNama] = useState(initialData ? initialData.nama : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Langkah 2.2: rapikan spasi, "Cuci   AC " menjadi "Cuci AC"
    const bersih = nama.trim().replace(/\s+/g, " ");

    if (!bersih) {
      setError("Nama kategori wajib diisi");
      return;
    }

    // Langkah 2.3: backend tidak mengecek nama kembar, jadi dicek di sini
    // (kategori yang sedang diedit dikecualikan)
    const kembar = existingKategori.some(
      (k) => normal(k.nama) === normal(bersih) && (!initialData || k.id !== initialData.id)
    );
    if (kembar) {
      setError("Nama kategori sudah ada");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit(bersih);
    } catch (err) {
      // TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
      setError(
        err instanceof TypeError
          ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
          : err.message
      );
      setSaving(false);
    }
  };

  return (
    // area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button onClick={onClose} disabled={saving} className="rounded p-1 hover:bg-gray-100 disabled:opacity-60">
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          Kategori dipakai untuk mengelompokkan layanan, misalnya "Service AC".
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Kategori</label>
            <input
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                setError("");
              }}
              maxLength={255}
              autoFocus
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}