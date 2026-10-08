// src/components/layanan/LayananTable.jsx
// hanya tombol "Tambah Layanan" (kategori punya tab sendiri)
import { useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

// warna badge bergantian, karena kategori dinamis dari database
const warnaKategori = [
  "bg-soft text-primary",
  "bg-yellow-100 text-yellow-700",
  "bg-accent text-white",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
];

export default function LayananTable({ data, kategoriList, onAdd, onEdit, onDelete }) {
  const [keyword, setKeyword] = useState("");
  // "Semua" atau id kategori
  const [kategoriId, setKategoriId] = useState("Semua");

  // warna badge mengikuti urutan kategori di daftar
  const warna = (id) => {
    const i = kategoriList.findIndex((k) => k.id === id);
    return warnaKategori[(i < 0 ? 0 : i) % warnaKategori.length];
  };

  const rows = data.filter((l) => {
    const cocokKata = l.nama.toLowerCase().includes(keyword.toLowerCase());
    const cocokKategori = kategoriId === "Semua" || l.categoryId === kategoriId;
    return cocokKata && cocokKategori;
  });

  const tombolFilter = (aktif) =>
    `rounded-lg border px-3 py-1 text-sm ${
      aktif ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
    }`;

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama layanan..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button onClick={() => setKategoriId("Semua")} className={tombolFilter(kategoriId === "Semua")}>
            Semua
          </button>
          {kategoriList.map((k) => (
            <button key={k.id} onClick={() => setKategoriId(k.id)} className={tombolFilter(kategoriId === k.id)}>
              {k.nama}
            </button>
          ))}
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        >
          <Plus size={16} />
          Tambah Layanan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {["No", "Nama Layanan", "Kategori", "Harga", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l, i) => (
              <tr key={l.id} className="border-b border-gray-100 align-top last:border-0">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">
                  <p className="font-medium">{l.nama}</p>
                  {l.deskripsi && <p className="text-xs text-gray-500">{l.deskripsi}</p>}
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${warna(l.categoryId)}`}>
                    {l.kategori}
                  </span>
                </td>
                <td className="px-3 py-2">Rp {l.harga.toLocaleString("id-ID")}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(l)} title="Edit" className="rounded p-1.5 text-secondary hover:bg-soft">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(l)} title="Hapus" className="rounded p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">Layanan tidak ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Menampilkan {rows.length} dari {data.length} layanan
      </p>
    </div>
  );
}