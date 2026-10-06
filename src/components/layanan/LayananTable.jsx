import { useState } from "react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

const kategoriColor = {
  Perawatan: "bg-soft text-primary",
  Perbaikan: "bg-yellow-100 text-yellow-700",
  Instalasi: "bg-accent text-white",
};
const statusColor = {
  Aktif: "bg-green-100 text-green-700",
  Nonaktif: "bg-red-100 text-red-700",
};
const kategoriList = ["Semua", "Perawatan", "Perbaikan", "Instalasi"];

const formatDurasi = (menit) => {
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  if (jam === 0) return `${sisa} menit`;
  if (sisa === 0) return `${jam} jam`;
  return `${jam} jam ${sisa} menit`;
};

export default function LayananTable({ data, pemakaian, onAdd, onEdit, onDelete }) {
  const [keyword, setKeyword] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const rows = data.filter((l) => {
    const cocokKata = l.nama.toLowerCase().includes(keyword.toLowerCase());
    const cocokKategori = kategori === "Semua" || l.kategori === kategori;
    return cocokKata && cocokKategori;
  });

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

          {kategoriList.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              className={`rounded-lg border px-3 py-1 text-sm ${
                kategori === k ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-soft"
              }`}
            >
              {k}
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
              {["No", "Nama Layanan", "Kategori", "Harga", "Durasi", "Dipakai di Booking", "Status", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l, i) => {
              const kodeBooking = pemakaian[l.id] || [];

              return (
                <tr key={l.id} className="border-b border-gray-100 align-top last:border-0">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{l.nama}</p>
                    <p className="text-xs text-gray-500">{l.deskripsi}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${kategoriColor[l.kategori]}`}>{l.kategori}</span>
                  </td>
                  <td className="px-3 py-2">Rp {l.harga.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2">{formatDurasi(l.durasi)}</td>

                  <td className="px-3 py-2">
                    {kodeBooking.length === 0 ? (
                      <span className="text-xs text-gray-400">Belum dipakai</span>
                    ) : (
                      <div>
                        <p className="mb-1 text-xs font-semibold text-primary">{kodeBooking.length} booking</p>
                        <div className="flex flex-wrap gap-1" title={kodeBooking.join(", ")}>
                          {kodeBooking.slice(0, 3).map((kode) => (
                            <span key={kode} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                              {kode}
                            </span>
                          ))}
                          {kodeBooking.length > 3 && (
                            <span className="px-1 py-0.5 text-xs text-gray-500">+{kodeBooking.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[l.status]}`}>{l.status}</span>
                  </td>
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
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">Layanan tidak ditemukan</td>
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