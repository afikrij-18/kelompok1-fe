// src/pages/LaporanPenjualan.jsx
// Langkah 4: laporan penjualan dari pembayaran yang berstatus paid, dengan pagination dan cetak
import { useEffect, useState } from "react";
import { Wallet, Receipt, TrendingUp, Printer } from "lucide-react";
import { getSalesReport } from "../services/transactionService";
import { METODE } from "../services/transactionMapper";
import { toISO } from "../utils/booking";
import { cetakDokumen } from "../utils/cetak";
import {
  dokumenLaporanPenjualan,
  teksRentangPenjualan,
} from "../utils/cetakLaporan";
import Pagination from "../components/Pagination";
import CetakLaporanDialog from "../components/laporan/CetakLaporanDialog";
import usePagination from "../components/hooks/usePagination";

const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

// Langkah 4.1: bagian yang bisa dipilih saat mencetak
const BAGIAN_CETAK = [
  {
    id: "ringkasan",
    label: "Ringkasan",
    keterangan: "Total omzet, jumlah transaksi, dan rata-rata",
    ringkas: true,
  },
  {
    id: "metode",
    label: "Rekap per metode pembayaran",
    keterangan: "Nominal dan porsi tiap metode",
    ringkas: true,
  },
  {
    id: "rincian",
    label: "Rincian transaksi",
    keterangan: "Semua transaksi pada periode, tidak terpotong halaman tabel",
  },
];

// rentang tanggal cepat
const bulanIni = () => {
  const n = new Date();
  return {
    from: toISO(new Date(n.getFullYear(), n.getMonth(), 1)),
    to: toISO(new Date(n.getFullYear(), n.getMonth() + 1, 0)),
  };
};
const bulanLalu = () => {
  const n = new Date();
  return {
    from: toISO(new Date(n.getFullYear(), n.getMonth() - 1, 1)),
    to: toISO(new Date(n.getFullYear(), n.getMonth(), 0)),
  };
};
const semuaWaktu = () => ({ from: "", to: "" });

export default function LaporanPenjualan() {
  // rentang yang sedang dipakai laporan, dan isian di kolom tanggal sebelum diterapkan
  const [rentang, setRentang] = useState(bulanIni);
  const [isian, setIsian] = useState(bulanIni);
  const [errorRentang, setErrorRentang] = useState("");

  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Langkah 4.2: dialog pilihan cetak
  const [showCetak, setShowCetak] = useState(false);

  // muat laporan setiap rentang berubah
  useEffect(() => {
    let batal = false; // cegah set state jika halaman sudah ditinggalkan
    setLoading(true);
    setError("");

    getSalesReport(rentang)
      .then((data) => {
        if (!batal) setLaporan(data);
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
  }, [rentang]);

  // terapkan tanggal dari kolom isian, kedua tanggal harus lengkap atau kosong
  const terapkan = () => {
    if (!!isian.from !== !!isian.to) {
      setErrorRentang(
        "Isi kedua tanggal, atau kosongkan keduanya untuk semua waktu.",
      );
      return;
    }
    if (isian.from && isian.from > isian.to) {
      setErrorRentang(
        "Tanggal awal tidak boleh lebih besar dari tanggal akhir.",
      );
      return;
    }
    setErrorRentang("");
    setRentang(isian);
  };

  const pakai = (r) => {
    setErrorRentang("");
    setIsian(r);
    setRentang(r);
  };

  // Langkah 4.3: cetak memakai rentang yang sedang diterapkan (bukan isian yang belum diterapkan)
  const handleCetak = ({ bagian, orientasi }) => {
    const periode = teksRentangPenjualan(rentang);
    cetakDokumen({
      judul: `Laporan Penjualan ${periode}`,
      isi: dokumenLaporanPenjualan({ laporan, periode, bagian }),
      orientasi,
    });
  };

  const rataRata =
    laporan && laporan.totalTransaksi > 0
      ? Math.round(laporan.totalOmzet / laporan.totalTransaksi)
      : 0;
  const metodeList = laporan ? Object.entries(laporan.perMetode) : [];

  // pagination tabel transaksi, kembali ke halaman 1 saat rentang tanggal berubah
  const hal = usePagination(
    laporan ? laporan.transaksi : [],
    10,
    `${rentang.from}|${rentang.to}`,
  );

  const tombol =
    "rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-soft";
  const inputTanggal =
    "rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">
          Laporan Penjualan
        </h1>

        {/* Langkah 4.4: tombol cetak, aktif setelah laporan termuat */}
        <button
          onClick={() => setShowCetak(true)}
          disabled={loading || Boolean(error) || !laporan}
          className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Printer size={16} />
          Cetak Laporan
        </button>
      </header>

      <main className="space-y-6 p-6">
        {/* filter tanggal */}
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-800">
                Dari
              </label>
              <input
                type="date"
                value={isian.from}
                onChange={(e) => setIsian({ ...isian, from: e.target.value })}
                className={inputTanggal}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-800">
                Sampai
              </label>
              <input
                type="date"
                value={isian.to}
                onChange={(e) => setIsian({ ...isian, to: e.target.value })}
                className={inputTanggal}
              />
            </div>
            <button
              onClick={terapkan}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
            >
              Terapkan
            </button>
            <div className="ml-auto flex flex-wrap gap-2">
              <button onClick={() => pakai(bulanIni())} className={tombol}>
                Bulan Ini
              </button>
              <button onClick={() => pakai(bulanLalu())} className={tombol}>
                Bulan Lalu
              </button>
              <button onClick={() => pakai(semuaWaktu())} className={tombol}>
                Semua Waktu
              </button>
            </div>
          </div>
          {errorRentang && (
            <p className="mt-2 text-xs text-red-600">{errorRentang}</p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading && <p className="text-sm text-gray-500">Memuat laporan...</p>}

        {!loading && !error && laporan && (
          <>
            {/* ringkasan */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  judul: "Total Omzet",
                  nilai: rupiah(laporan.totalOmzet),
                  icon: Wallet,
                },
                {
                  judul: "Jumlah Transaksi",
                  nilai: String(laporan.totalTransaksi),
                  icon: Receipt,
                },
                {
                  judul: "Rata-rata per Transaksi",
                  nilai: rupiah(rataRata),
                  icon: TrendingUp,
                },
              ].map((k) => (
                <div
                  key={k.judul}
                  className="flex items-center gap-4 rounded-xl bg-white p-5 shadow"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-soft text-primary">
                    <k.icon size={22} />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">{k.judul}</p>
                    <p className="text-xl font-bold text-primary">{k.nilai}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* rekap per metode pembayaran */}
            <section className="rounded-xl bg-white p-5 shadow">
              <h2 className="mb-3 text-base font-semibold text-primary">
                Rekap per Metode Pembayaran
              </h2>
              {metodeList.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Belum ada pembayaran pada periode ini.
                </p>
              ) : (
                <ul className="space-y-3">
                  {metodeList.map(([kode, nominal]) => {
                    const persen =
                      laporan.totalOmzet > 0
                        ? Math.round((nominal / laporan.totalOmzet) * 100)
                        : 0;
                    return (
                      <li key={kode}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium">
                            {METODE[kode] || kode}
                          </span>
                          <span>
                            {rupiah(nominal)}{" "}
                            <span className="text-gray-400">({persen}%)</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-soft">
                          <div
                            className="h-2 rounded-full bg-secondary"
                            style={{ width: `${persen}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* daftar transaksi dengan pagination */}
            <section className="rounded-xl bg-white p-5 shadow">
              <h2 className="mb-3 text-base font-semibold text-primary">
                Daftar Transaksi
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
              <thead className="bg-soft text-primary uppercase text-xs">
                <tr>
                  {["No", "No Invoice", "Booking", "Waktu Bayar", "Metode", "Dibayar", "Catatan"].map((h) => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hal.pageItems.map((t, i) => (
                  <tr
                    key={t.id}
                    className="hover:bg-soft/20 align-top transition"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500">{hal.mulai + i + 1}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                      {t.invoice}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {t.kodeBooking}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.waktuBayar}</td>
                    <td className="px-4 py-3 text-sm">{t.metode}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {rupiah(t.dibayar)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {t.catatan || "-"}
                    </td>
                  </tr>
                ))}
                {laporan.transaksi.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-gray-500 italic"
                    >
                      Tidak ada transaksi pada periode ini
                    </td>
                  </tr>
                )}
              </tbody>
                </table>
              </div>

              <Pagination {...hal} onChange={hal.setPage} />

              <p className="mt-3 text-xs text-gray-500">
                Laporan hanya memuat pembayaran berstatus lunas (paid).
              </p>
            </section>
          </>
        )}
      </main>

      {/* Langkah 4.5: dialog pilihan cetak */}
      {showCetak && (
        <CetakLaporanDialog
          judul="Cetak Laporan Penjualan"
          bagian={BAGIAN_CETAK}
          onCetak={handleCetak}
          onClose={() => setShowCetak(false)}
        />
      )}
    </>
  );
}