// src/components/layanan/KategoriTable.jsx
// Langkah 4: tabel kategori dengan tombol tambah sendiri dan pagination
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import Pagination from "../Pagination";
import usePagination from "../hooks/usePagination";

export default function KategoriTable({
  data,
  layanan,
  onAdd,
  onEdit,
  onDelete,
}) {
  // jumlah layanan per kategori, dihitung dari daftar layanan yang sudah dimuat
  const jumlah = (id) => layanan.filter((l) => l.categoryId === id).length;

  // Langkah 4.1: 10 baris per halaman
  const hal = usePagination(data, 10);

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-primary">
          Daftar Kategori
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-secondary hover:bg-soft"
        >
          <FolderPlus size={16} />
          Tambah Kategori
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {["No", "Nama Kategori", "Jumlah Layanan", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Langkah 4.2: hanya baris di halaman aktif, nomor urut berlanjut antar halaman */}
            {hal.pageItems.map((k, i) => (
              <tr key={k.id} className="border-b border-gray-100 last:border-0">
                <td className="px-3 py-2">{hal.mulai + i + 1}</td>
                <td className="px-3 py-2 font-medium">{k.nama}</td>
                <td className="px-3 py-2">{jumlah(k.id)} layanan</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(k)}
                      title="Edit"
                      className="rounded p-1.5 text-secondary hover:bg-soft"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(k)}
                      title="Hapus"
                      className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Belum ada kategori
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Langkah 4.3: kontrol halaman, menggantikan teks "Menampilkan x kategori" */}
      <Pagination {...hal} onChange={hal.setPage} />
    </div>
  );
}