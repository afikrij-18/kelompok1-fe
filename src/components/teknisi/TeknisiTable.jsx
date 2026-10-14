// src/components/teknisi/TeknisiTable.jsx
// Langkah 2: tabel teknisi dengan cari, filter status, dan pagination
import { useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../hooks/usePagination";
import { getUser } from "../../services/authService";

const statusColor = {
  Aktif: "bg-green-100 text-green-700",
  Nonaktif: "bg-red-100 text-red-700",
};

const filterList = ["Semua", "Aktif", "Nonaktif"];

export default function TeknisiTable({ data, onAdd, onEdit, onDelete }) {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("Semua");

  const isOwner = getUser()?.role === "owner";

  const rows = data.filter((t) => {
    const cocokKata =
      t.nama.toLowerCase().includes(keyword.toLowerCase()) ||
      t.telepon.includes(keyword);
    return cocokKata && (filter === "Semua" || t.status === filter);
  });

  // Langkah 2.1: 10 baris per halaman, kembali ke halaman 1 saat cari atau filter berubah
  const hal = usePagination(rows, 10, `${keyword}|${filter}`);

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama atau telepon..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {filterList.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3 py-1 text-sm ${
                filter === f
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 hover:bg-soft"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        >
          <Plus size={16} />
          Tambah Teknisi
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {["No", "Nama", "Telepon", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Langkah 2.2: hanya baris di halaman aktif, nomor urut berlanjut antar halaman */}
            {hal.pageItems.map((t, i) => (
              <tr key={t.id} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2">{hal.mulai + i + 1}</td>
                <td className="px-3 py-2 font-medium">{t.nama}</td>
                <td className="px-3 py-2">{t.telepon || "-"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${statusColor[t.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(t)}
                      title="Edit"
                      className="rounded p-1.5 text-secondary hover:bg-soft"
                    >
                      <Pencil size={16} />
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => onDelete(t)}
                        title="Hapus"
                        className="rounded p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Teknisi tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Langkah 2.3: kontrol halaman, menggantikan teks "Menampilkan x dari y teknisi" */}
      <Pagination {...hal} onChange={hal.setPage} />
    </div>
  );
}