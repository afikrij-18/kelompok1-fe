// src/components/teknisi/TeknisiForm.jsx
// Langkah 3: dialog tambah dan edit teknisi
import { useState } from "react";
import { X } from "lucide-react";

const kosong = { nama: "", telepon: "", status: "Aktif" };

// nama field backend -> nama field form
const FIELD_DARI_API = { name: "nama", phone: "telepon", status: "status" };

// samakan huruf besar-kecil dan spasi ganda sebelum membandingkan nama
const normal = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

// Langkah 3.1: ubah error dari server menjadi pesan di bawah kolom yang bersangkutan
const errorDariServer = (err) => {
  const e = {};

  if (Array.isArray(err.errors)) {
    err.errors.forEach((x) => {
      e[FIELD_DARI_API[x.field] || "form"] = x.message;
    });
  } else if (err instanceof TypeError) {
    e.form =
      "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.";
  } else {
    e.form = err.message;
  }

  if (Object.keys(e).length === 0) e.form = err.message;
  return e;
};

export default function TeknisiForm({
  initialData,
  existingTeknisi,
  onSubmit,
  onClose,
}) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(
    initialData ? { ...kosong, ...initialData } : kosong,
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "", form: "" });
  };

  // Langkah 3.2: validasi, teknisi lain = selain yang sedang diedit
  const validate = () => {
    const e = {};
    const lain = existingTeknisi.filter((t) => t.id !== form.id);

    if (form.nama.trim().length < 2 || form.nama.trim().length > 100) {
      e.nama = "Nama harus 2-100 karakter";
    } else if (lain.some((t) => normal(t.nama) === normal(form.nama))) {
      e.nama = "Nama teknisi sudah ada";
    }

    // telepon boleh kosong, kalau diisi 10-15 digit angka
    if (form.telepon && !/^\d{10,15}$/.test(form.telepon)) {
      e.telepon = "Telepon harus 10-15 digit angka";
    } else if (form.telepon && lain.some((t) => t.telepon === form.telepon)) {
      e.telepon = "Nomor telepon sudah dipakai teknisi lain";
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
    // Langkah 3.3: area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit Teknisi" : "Tambah Teknisi"}
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-60"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {errors.form && (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className={inputClass("nama")}
            />
            {errors.nama && (
              <p className="mt-1 text-xs text-red-600">{errors.nama}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Telepon (opsional)
            </label>
            <input
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              className={inputClass("telepon")}
            />
            {errors.telepon && (
              <p className="mt-1 text-xs text-red-600">{errors.telepon}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass("status")}
            >
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600">{errors.status}</p>
            )}
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