// src/components/user/UserForm.jsx
import { useState } from "react";
import { X } from "lucide-react";

const kosong = {
  nama: "",
  email: "",
  telepon: "",
  password: "",
  role: "Teknisi",
  status: "Aktif",
};

// nama field backend -> nama field form
const FIELD_DARI_API = {
  name: "nama",
  email: "email",
  phone: "telepon",
  password: "password",
  role: "role",
  status: "status",
};

// samakan huruf besar-kecil dan spasi ganda sebelum membandingkan nama
const normal = (s) => s.trim().replace(/\s+/g, " ").toLowerCase();

// ubah error dari server menjadi pesan di bawah kolom yang bersangkutan
const errorDariServer = (err) => {
  const e = {};

  if (Array.isArray(err.errors)) {
    err.errors.forEach((x) => {
      e[FIELD_DARI_API[x.field] || "form"] = x.message;
    });
  } else if (err.status === 409) {
    e.email = err.message; // 409 dari backend = email sudah digunakan
  } else if (err instanceof TypeError) {
    e.form = "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.";
  } else {
    e.form = err.message;
  }

  if (Object.keys(e).length === 0) e.form = err.message;
  return e;
};

export default function UserForm({ initialData, existingUsers, onSubmit, onClose }) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(initialData ? { ...kosong, ...initialData } : kosong);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "", form: "" });
  };

  // validasi, aturannya mengikuti models/User.js dan UserController.js
  const validate = () => {
    const e = {};

    const lain = existingUsers.filter((u) => u.id !== form.id); // user lain, yang sedang diedit dikecualikan

    if (form.nama.trim().length < 2 || form.nama.trim().length > 100) {
      e.nama = "Nama harus 2-100 karakter";
    } else if (lain.some((u) => normal(u.nama) === normal(form.nama))) {
      e.nama = "Nama sudah dipakai user lain";
    }

    if (!form.email.trim()) {
      e.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Format email tidak valid";
    } else if (
      existingUsers.some(
        (u) => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== form.id
      )
    ) {
      e.email = "Email sudah terdaftar";
    }

    // telepon boleh kosong, kalau diisi 10-15 digit angka
    if (form.telepon && !/^\d{10,15}$/.test(form.telepon)) {
      e.telepon = "Telepon harus 10-15 digit angka";
    } else if (form.telepon && lain.some((u) => u.telepon === form.telepon)) {
      e.telepon = "Nomor telepon sudah dipakai user lain";
    }

    // Langkah 4.1: password hanya dicek saat tambah, saat edit diganti lewat dialog sendiri
    if (!isEdit && form.password.length < 6) {
      e.password = "Password minimal 6 karakter";
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
    // Langkah 4.2: area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? "Edit User" : "Tambah User"}
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
            <label className="mb-1 block text-sm font-medium">Nama</label>
            <input name="nama" value={form.nama} onChange={handleChange} className={inputClass("nama")} />
            {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Telepon (opsional)</label>
            <input name="telepon" value={form.telepon} onChange={handleChange} className={inputClass("telepon")} />
            {errors.telepon && <p className="mt-1 text-xs text-red-600">{errors.telepon}</p>}
          </div>

          {/* Langkah 4.3: kolom password hanya saat tambah user */}
          {!isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass("password")}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass("role")}>
                <option>Admin</option>
                <option>Owner</option>
                <option>Teknisi</option>
              </select>
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass("status")}>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
            </div>
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