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

export default function UserForm({ initialData, existingUsers, onSubmit, onClose }) {
  // Langkah 1.3: mode edit jika initialData ada
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(initialData ? { ...kosong, ...initialData } : kosong);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.nama.trim()) e.nama = "Nama wajib diisi";

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

    if (!/^\d{10,13}$/.test(form.telepon)) {
      e.telepon = "Telepon harus 10-13 digit angka";
    }

    if (!isEdit && form.password.length < 6) {
      e.password = "Password minimal 6 karakter";
    }

    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const hasil = validate();
    setErrors(hasil);

    if (Object.keys(hasil).length > 0) return;

    const { password, ...data } = form;
    onSubmit(data);
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
            {isEdit ? "Edit User" : "Tambah User"}
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
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
            <label className="mb-1 block text-sm font-medium">Telepon</label>
            <input name="telepon" value={form.telepon} onChange={handleChange} className={inputClass("telepon")} />
            {errors.telepon && <p className="mt-1 text-xs text-red-600">{errors.telepon}</p>}
          </div>

          {!isEdit && (
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass("password")} />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className={inputClass("role")}>
                <option>Admin</option>
                <option>Teknisi</option>
                <option>Pelanggan</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass("status")}>
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>
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