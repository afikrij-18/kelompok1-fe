// src/components/user/ChangePasswordDialog.jsx
// dialog kecil dengan satu kolom password baru
import { useState } from "react";
import { X } from "lucide-react";

export default function ChangePasswordDialog({ user, onSubmit, onClose }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Langkah 3.1: aturan sama dengan backend, minimal 6 karakter
    if (password.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit(password);
    } catch (err) {
      // Langkah 3.2: TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
      setError(
        err instanceof TypeError
          ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
          : err.message
      );
      setSaving(false);
    }
  };

  return (
    // Langkah 3.3: area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Ganti Password</h2>
          <button onClick={onClose} disabled={saving} className="rounded p-1 hover:bg-gray-100 disabled:opacity-60">
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          Password baru untuk <span className="font-semibold text-gray-800">{user.nama}</span> ({user.email}).
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium">Password Baru</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="new-password"
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