// src/pages/UangKeluar.jsx  (FE, DIGANTI seluruh isi)
// Langkah 3: halaman Uang Keluar, dengan form tambah dan edit, serta cetak laporan
import { useEffect, useState } from "react";
import { Plus, Printer } from "lucide-react";
import ExpenseSummary from "../components/uangkeluar/ExpenseSummary";
import ExpenseTable from "../components/uangkeluar/ExpenseTable";
import ExpenseForm from "../components/uangkeluar/ExpenseForm.jsx";
import CetakLaporanDialog from "../components/laporan/CetakLaporanDialog";
import { KATEGORI_KELUAR } from "../data/expenseOptions";
import {
  getExpenses,
  createExpense,
  updateExpense,
} from "../services/expenseService";
import {
  rentangBulan,
  namaBulan,
  ringkasPengeluaran,
  formatTanggalPendek,
} from "../utils/pengeluaran";
import { cetakDokumen } from "../utils/cetak";
import { dokumenLaporanPengeluaran } from "../utils/cetakLaporan";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

// Tombol periode cepat
const PRESET = [
  { id: "bulan-ini", label: "Bulan Ini" },
  { id: "bulan-lalu", label: "Bulan Lalu" },
  { id: "semua", label: "Semua Waktu" },
];

// Langkah 3.8: bagian yang bisa dipilih saat mencetak
const BAGIAN_CETAK = [
  {
    id: "ringkasan",
    label: "Ringkasan",
    keterangan: "Total, jumlah catatan, dan kategori terbesar",
    ringkas: true,
  },
  {
    id: "kategori",
    label: "Rekap per kategori",
    keterangan: "Total dan porsi tiap kategori",
    ringkas: true,
  },
  {
    id: "rincian",
    label: "Rincian pengeluaran",
    keterangan: "Semua catatan, tidak terpotong halaman tabel",
  },
];

// Langkah 3.9: pilihan kategori pada dialog cetak
const FILTER_CETAK = {
  label: "Kategori",
  opsi: [
    { value: "Semua", label: "Semua kategori" },
    ...KATEGORI_KELUAR.map((k) => ({ value: k, label: k })),
  ],
};

export default function UangKeluar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [percobaan, setPercobaan] = useState(0);

  // Langkah 3.1: form dibuka atau ditutup, editing = pengeluaran yang diedit (null = mode tambah)
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Langkah 3.2: pesan di atas tabel, { tipe: "sukses" | "error", teks }
  const [pesan, setPesan] = useState(null);

  // Langkah 3.10: dialog pilihan cetak
  const [showCetak, setShowCetak] = useState(false);

  // filter awal = bulan ini, "custom" dipakai saat tanggal diisi sendiri
  const [filter, setFilter] = useState({
    preset: "bulan-ini",
    ...rentangBulan(0),
  });

  // muat data saat halaman dibuka dan setiap kali "Coba lagi"
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

  // pilih periode cepat
  const pilihPreset = (id) => {
    if (id === "bulan-ini") setFilter({ preset: id, ...rentangBulan(0) });
    else if (id === "bulan-lalu")
      setFilter({ preset: id, ...rentangBulan(-1) });
    else setFilter({ preset: id, dari: "", sampai: "" });
  };

  // mengisi tanggal sendiri mengubah periode menjadi "custom"
  const ubahTanggal = (field, nilai) =>
    setFilter((f) => ({ ...f, preset: "custom", [field]: nilai }));

  // filter hanya aktif jika kedua tanggal terisi, tanggal akhir tidak boleh lebih awal
  const adaRentang = Boolean(filter.dari && filter.sampai);
  const rentangSalah = adaRentang && filter.dari > filter.sampai;
  const terfilter = rentangSalah
    ? []
    : adaRentang
      ? data.filter(
          (e) => e.tanggal >= filter.dari && e.tanggal <= filter.sampai,
        )
      : data;

  // teks periode untuk kartu ringkasan
  let periode = "Semua waktu";
  if (filter.preset === "bulan-ini") periode = `Bulan ini (${namaBulan(0)})`;
  else if (filter.preset === "bulan-lalu")
    periode = `Bulan lalu (${namaBulan(-1)})`;
  else if (adaRentang && !rentangSalah) {
    periode = `${formatTanggalPendek(filter.dari)} - ${formatTanggalPendek(filter.sampai)}`;
  }

  const ringkasan = ringkasPengeluaran(terfilter);

  // Langkah 3.11: cetak memakai pengeluaran pada periode yang sedang tampil
  // (kotak cari di tabel tidak ikut, kategori dipilih di dialog cetak)
  const handleCetak = ({ bagian, orientasi, filter: kategori }) => {
    cetakDokumen({
      judul: `Laporan Uang Keluar ${periode}`,
      isi: dokumenLaporanPengeluaran({
        data: terfilter,
        periode,
        bagian,
        kategori,
      }),
      orientasi,
    });
  };

  // Langkah 3.3: buka form kosong untuk tambah
  const handleAdd = () => {
    setEditing(null);
    setPesan(null);
    setShowForm(true);
  };

  // Langkah 3.4: buka form berisi data yang dipilih untuk edit
  const handleEdit = (pengeluaran) => {
    setEditing(pengeluaran);
    setPesan(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
  };

  // Langkah 3.5: dipanggil ExpenseForm setelah validasi lolos
  // error dari service dilempar ke form agar tampil di dalam dialog
  const handleSubmit = async (form) => {
    if (editing) await updateExpense(editing.id, form);
    else await createExpense(form);

    // tanggal di luar periode yang sedang tampil tidak terlihat di tabel, beri tahu
    const diLuarPeriode =
      adaRentang &&
      (form.tanggal < filter.dari || form.tanggal > filter.sampai);
    const aksi = editing ? "diperbarui" : "ditambahkan";
    handleClose();
    setPesan({
      tipe: "sukses",
      teks: `Pengeluaran "${form.keterangan.trim()}" berhasil ${aksi}.${
        diLuarPeriode ? " Tanggalnya di luar periode yang sedang tampil." : ""
      }`,
    });

    // muat ulang daftar, kegagalan di sini dilaporkan di halaman, bukan di form
    try {
      setData(await getExpenses());
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    }
  };

  // sementara hanya dicetak, diganti dialog hapus di Tahap 3
  const handleDelete = (pengeluaran) =>
    console.log("hapus pengeluaran", pengeluaran);

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Uang Keluar</h1>
      </header>

      <main className="space-y-6 p-6">
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Langkah 3.12: tombol cetak, aktif jika ada pengeluaran pada periode yang tampil */}
            <button
              onClick={() => setShowCetak(true)}
              disabled={loading || Boolean(error) || terfilter.length === 0}
              title={
                terfilter.length === 0
                  ? "Tidak ada data pada periode ini"
                  : "Cetak laporan uang keluar"
              }
              className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer size={16} />
              Cetak Laporan
            </button>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
            >
              <Plus size={16} />
              Tambah Pengeluaran
            </button>
          </div>
        </div>

        {/* Langkah 3.6: pesan sukses (hijau) atau error (merah), bisa ditutup */}
        {pesan && (
          <div
            className={`flex items-start justify-between gap-3 rounded-lg px-4 py-2 text-sm ${
              pesan.tipe === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <span>{pesan.teks}</span>
            <button onClick={() => setPesan(null)} className="font-bold">
              ×
            </button>
          </div>
        )}

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

      {/* Langkah 3.7: form hanya dirender saat dibuka, sehingga selalu mulai dari kondisi segar */}
      {showForm && (
        <ExpenseForm
          initialData={editing}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {/* Langkah 3.13: dialog pilihan cetak */}
      {showCetak && (
        <CetakLaporanDialog
          judul="Cetak Laporan Uang Keluar"
          bagian={BAGIAN_CETAK}
          filter={FILTER_CETAK}
          onCetak={handleCetak}
          onClose={() => setShowCetak(false)}
        />
      )}
    </>
  );
}