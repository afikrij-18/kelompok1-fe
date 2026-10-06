import { useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

const roleColor = {
  Admin: "bg-primary text-white",
  Owner: "bg-accent text-white",
  Teknisi: "bg-soft text-primary",
};
const statusColor = {
  Aktif: "bg-green-100 text-green-700",
  Nonaktif: "bg-red-100 text-red-700",
};

const roles = ["Semua", "Admin", "Owner", "Teknisi"];

export default function UserTable({ data, onAdd, onEdit, onDelete }) {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("Semua");

  const rows = data.filter((u) => {
    const cocokKata =
      u.nama.toLowerCase().includes(keyword.toLowerCase()) ||
      u.email.toLowerCase().includes(keyword.toLowerCase());
    const cocokRole = role === "Semua" || u.role === role;
    return cocokKata && cocokRole;
  });

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`rounded-lg border px-3 py-1 text-sm ${
                role === r ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        >
          <Plus size={16} />
          Tambah User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {["No", "Nama", "Email", "Telepon", "Role", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-medium">{u.nama}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.telepon}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${roleColor[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[u.status]}`}>{u.status}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(u)}
                      title="Edit"
                      className="rounded p-1.5 text-secondary hover:bg-soft"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      title="Hapus"
                      className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  User tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Menampilkan {rows.length} dari {data.length} user
      </p>
    </div>
  );
}