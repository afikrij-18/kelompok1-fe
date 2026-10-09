// src/components/uangkeluar/ExpenseTable.jsx  (FE, BARU)
// Langkah 7: tabel uang keluar dengan pencarian dan filter kategori
import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import {
  KATEGORI_KELUAR,
  WARNA_KATEGORI,
  labelMetodeKeluar,
} from "../../data/expenseOptions";
import { formatRupiah } from "../../utils/booking";
import { formatTanggalPendek } from "../../utils/pengeluaran";

// Langkah 7.1: data = uang keluar pada periode terpilih, onEdit dan onDelete menerima satu data
export default function ExpenseTable({ data, onEdit, onDelete }) {
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("Semua");

  // Langkah 7.2: saring berdasarkan keterangan dan kategori
  const rows = data.filter((e) => {
    const cocokKata = e.keterangan
      .toLowerCase()
      .includes(keyword.toLowerCase());
    const cocokKategori = kategori === "Semua" || e.kategori === kategori;
    return cocokKata && cocokKategori;
  });

  const totalTampil = rows.reduce((jumlah, e) => jumlah + e.jumlah, 0);

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="mr-2 text-lg font-semibold text-primary">
          Daftar Pengeluaran
        </h2>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari keterangan..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="Semua">Semua kategori</option>
          {KATEGORI_KELUAR.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soft text-primary">
            <tr>
              {[
                "No",
                "Tanggal",
                "Kategori",
                "Keterangan",
                "Metode",
                "Jumlah",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-3 py-2 ${h === "Jumlah" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e, i) => (
              <tr
                key={e.id}
                className="border-b border-gray-100 align-top last:border-0"
              >
                <td className="px-3 py-2">{i + 1}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  {formatTanggalPendek(e.tanggal)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs ${
                      WARNA_KATEGORI[e.kategori] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {e.kategori}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{e.keterangan}</p>
                  {e.catatan && (
                    <p className="text-xs text-gray-500">{e.catatan}</p>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {labelMetodeKeluar(e.metode)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-medium">
                  {formatRupiah(e.jumlah)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(e)}
                      title="Edit"
                      className="rounded p-1.5 text-secondary hover:bg-soft"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(e)}
                      title="Hapus"
                      className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Langkah 7.3: pesan kosong dibedakan, periode tanpa data atau hasil saringan kosong */}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  {data.length === 0
                    ? "Belum ada pengeluaran pada periode ini"
                    : "Pengeluaran tidak ditemukan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Menampilkan {rows.length} dari {data.length} catatan, total{" "}
        {formatRupiah(totalTampil)}
      </p>
    </div>
  );
}