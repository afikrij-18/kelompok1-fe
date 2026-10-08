// src/components/layanan/LayananForm.jsx
// Field mengikuti models/Service.js: nama, kategori, harga, deskripsi
import { useState } from "react";
import { X } from "lucide-react";

// ubah error dari server menjadi pesan di form
const errorDariServer = (err) => {
  if (err instanceof TypeError) {
    return { form: "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan." };
  }
  // 404 "Kategori tidak ditemukan" ditampilkan di bawah kolom kategori
  if (err.status === 404 && /kategori/i.test(err.message)) {
    return { categoryId: err.message };
  }
  return { form: err.message };
};

// samakan huruf besar-kecil dan spasi ganda sebelum membandingkan nama
const normal = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

export default function LayananForm({ initialData, existingLayanan, kategoriList, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  // select bekerja dengan teks, jadi id kategori, harga disimpan sebagai String di form
  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          categoryId: String(initialData.categoryId),
          harga: String(initialData.harga),
        }
      : {
          nama: "",
          categoryId: kategoriList.length ? String(kategoriList[0].id) : "",
          harga: "",
          deskripsi: "",
        }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "", form: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.nama.trim()) {
      e.nama = "Nama layanan wajib diisi";
    } else if (
      existingLayanan.some(
        (l) => normal(l.nama) === normal(form.nama) && l.id !== form.id
      )
    ) {
      e.nama = "Nama layanan sudah ada";
    }

    if (!form.categoryId) {
      e.categoryId = "Kategori wajib dipilih";
    }

    // harga di database bertipe INTEGER, jadi harus bilangan bulat
    const harga = Number(form.harga);
    if (!form.harga || !Number.isInteger(harga) || harga <= 0) {
      e.harga = "Harga harus berupa angka bulat lebih dari 0";
    }

    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const hasil = validate();
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors(errorDariServer(err));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (name) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    // area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit Layanan" : "Tambah Layanan"}
          </h2>
          <button onClick={onClose} disabled={saving} className="rounded p-1 hover:bg-gray-100 disabled:opacity-60">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {errors.form && (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{errors.form}</p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Layanan</label>
            <input name="nama" value={form.nama} onChange={handleChange} className={inputClass("nama")} />
            {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kategori</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass("categoryId")}>
              {kategoriList.length === 0 && <option value="">Belum ada kategori</option>}
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
            <input name="harga" type="number" min="0" value={form.harga} onChange={handleChange} className={inputClass("harga")} />
            {errors.harga && <p className="mt-1 text-xs text-red-600">{errors.harga}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Deskripsi (opsional)</label>
            <textarea name="deskripsi" rows={3} value={form.deskripsi} onChange={handleChange} className={inputClass("deskripsi")} />
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