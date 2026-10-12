// src/pages/UangKeluar.jsx  (FE, DIGANTI seluruh isi)
// Langkah 8: halaman Uang Keluar, filter tanggal, ringkasan, dan tabel
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ExpenseSummary from "../components/uangkeluar/ExpenseSummary";
import ExpenseTable from "../components/uangkeluar/ExpenseTable";
import { getExpenses } from "../services/expenseService";
import {
  rentangBulan,
  namaBulan,
  ringkasPengeluaran,
  formatTanggalPendek,
} from "../utils/pengeluaran";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

// Langkah 8.1: tombol periode cepat
const PRESET = [
  { id: "bulan-ini", label: "Bulan Ini" },
  { id: "bulan-lalu", label: "Bulan Lalu" },
  { id: "semua", label: "Semua Waktu" },
];

export default function UangKeluar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [percobaan, setPercobaan] = useState(0);

  // Langkah 8.2: filter awal = bulan ini, "custom" dipakai saat tanggal diisi sendiri
  const [filter, setFilter] = useState({
    preset: "bulan-ini",
    ...rentangBulan(0),
  });

  // Langkah 8.3: muat data saat halaman dibuka dan setiap kali "Coba lagi"
  useEffect(() => {
    let batal = false;
    getExpenses()
      .then((hasil) => {
        if (!batal) setData(hasil);
      })
      .catch((err) => {
        if (!batal) setError(pesanError(err));
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });
    return () => {
      batal = true;
    };
  }, [percobaan]);

  const cobaLagi = () => {
    setError("");
    setLoading(true);
    setPercobaan((p) => p + 1);
  };

  // Langkah 8.4: pilih periode cepat
  const pilihPreset = (id) => {
    if (id === "bulan-ini") setFilter({ preset: id, ...rentangBulan(0) });
    else if (id === "bulan-lalu")
      setFilter({ preset: id, ...rentangBulan(-1) });
    else setFilter({ preset: id, dari: "", sampai: "" });
  };

  // Langkah 8.5: mengisi tanggal sendiri mengubah periode menjadi "custom"
  const ubahTanggal = (field, nilai) =>
    setFilter((f) => ({ ...f, preset: "custom", [field]: nilai }));

  // Langkah 8.6: filter hanya aktif jika kedua tanggal terisi, tanggal akhir tidak boleh lebih awal
  const adaRentang = Boolean(filter.dari && filter.sampai);
  const rentangSalah = adaRentang && filter.dari > filter.sampai;
  const terfilter = rentangSalah
    ? []
    : adaRentang
      ? data.filter(
          (e) => e.tanggal >= filter.dari && e.tanggal <= filter.sampai,
        )
      : data;

  // Langkah 8.7: teks periode untuk kartu ringkasan
  let periode = "Semua waktu";
  if (filter.preset === "bulan-ini") periode = `Bulan ini (${namaBulan(0)})`;
  else if (filter.preset === "bulan-lalu")
    periode = `Bulan lalu (${namaBulan(-1)})`;
  else if (adaRentang && !rentangSalah) {
    periode = `${formatTanggalPendek(filter.dari)} - ${formatTanggalPendek(filter.sampai)}`;
  }

  const ringkasan = ringkasPengeluaran(terfilter);

  // Langkah 8.8: sementara hanya dicetak, diganti dialog di Tahap 2
  const handleAdd = () => console.log("tambah pengeluaran");
  const handleEdit = (e) => console.log("edit pengeluaran", e);
  const handleDelete = (e) => console.log("hapus pengeluaran", e);

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Uang Keluar</h1>
      </header>

      <main className="space-y-6 p-6">
        {/* Langkah 8.9: baris filter periode dan tombol tambah */}
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl bg-white p-4 shadow">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex gap-2">
              {PRESET.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pilihPreset(p.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    filter.preset === p.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:bg-soft"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">Dari</label>
              <input
                type="date"
                value={filter.dari}
                onChange={(e) => ubahTanggal("dari", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Sampai</label>
              <input
                type="date"
                value={filter.sampai}
                onChange={(e) => ubahTanggal("sampai", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus size={16} />
            Tambah Pengeluaran
          </button>
        </div>

        {rentangSalah && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            Tanggal akhir tidak boleh lebih awal dari tanggal awal.
          </p>
        )}
        {filter.preset === "custom" && !adaRentang && (
          <p className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800">
            Isi kedua tanggal (dari dan sampai) untuk memfilter, sementara ini
            semua waktu yang tampil.
          </p>
        )}

        {error && (
          <p className="flex items-center justify-between gap-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={cobaLagi} className="font-bold underline">
              Coba lagi
            </button>
          </p>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Memuat data uang keluar...</p>
        ) : (
          !error && (
            <>
              <ExpenseSummary ringkasan={ringkasan} periode={periode} />
              <ExpenseTable
                data={terfilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )
        )}
      </main>
    </>
  );
}