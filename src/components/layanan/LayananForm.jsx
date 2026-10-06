import { useState } from "react";
import { X } from "lucide-react";

const kosong = {
  nama: "",
  kategori: "Perawatan",
  harga: "",
  durasi: "",
  deskripsi: "",
  status: "Aktif",
};

export default function LayananForm({ initialData, existingLayanan, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(
    initialData
      ? { ...initialData, harga: String(initialData.harga), durasi: String(initialData.durasi) }
      : kosong
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.nama.trim()) {
      e.nama = "Nama layanan wajib diisi";
    } else if (
      existingLayanan.some(
        (l) => l.nama.toLowerCase() === form.nama.trim().toLowerCase() && l.id !== form.id
      )
    ) {
      e.nama = "Nama layanan sudah ada";
    }

    const harga = Number(form.harga);
    if (!form.harga || !Number.isInteger(harga) || harga <= 0) {
      e.harga = "Harga harus berupa angka lebih dari 0";
    }

    const durasi = Number(form.durasi);
    if (!form.durasi || !Number.isInteger(durasi) || durasi <= 0) {
      e.durasi = "Durasi harus berupa angka menit lebih dari 0";
    }

    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const hasil = validate();
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;

    onSubmit({
      ...form,
      nama: form.nama.trim(),
      deskripsi: form.deskripsi.trim(),
      harga: Number(form.harga),
      durasi: Number(form.durasi),
    });
  };

  const inputClass = (name) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit Layanan" : "Tambah Layanan"}
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Nama Layanan</label>
            <input name="nama" value={form.nama} onChange={handleChange} className={inputClass("nama")} />
            {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kategori</label>
            <select name="kategori" value={form.kategori} onChange={handleChange} className={inputClass("kategori")}>
              <option>Perawatan</option>
              <option>Perbaikan</option>
              <option>Instalasi</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Harga (Rp)</label>
              <input name="harga" type="number" min="0" value={form.harga} onChange={handleChange} className={inputClass("harga")} />
              {errors.harga && <p className="mt-1 text-xs text-red-600">{errors.harga}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Durasi (menit)</label>
              <input name="durasi" type="number" min="0" value={form.durasi} onChange={handleChange} className={inputClass("durasi")} />
              {errors.durasi && <p className="mt-1 text-xs text-red-600">{errors.durasi}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Deskripsi</label>
            <textarea name="deskripsi" rows={3} value={form.deskripsi} onChange={handleChange} className={inputClass("deskripsi")} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass("status")}>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}