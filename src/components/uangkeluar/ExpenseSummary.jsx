// src/components/uangkeluar/ExpenseSummary.jsx  (FE, BARU)
// Langkah 6: tiga kartu ringkasan dan rekap per kategori
import { TrendingDown, Receipt, Tag } from "lucide-react";
import { formatRupiah } from "../../utils/booking";

// Langkah 6.1: satu kartu angka
function Kartu({ icon: Icon, judul, nilai, keterangan }) {
  return (
    <div className="rounded-xl border-l-4 border-primary bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{judul}</p>
        <Icon size={20} className="text-secondary" />
      </div>
      <p className="mt-2 text-2xl font-bold text-primary">{nilai}</p>
      <p className="mt-1 text-xs text-gray-500">{keterangan}</p>
    </div>
  );
}

// Langkah 6.2: ringkasan = hasil ringkasPengeluaran, periode = teks periode yang dipilih
export default function ExpenseSummary({ ringkasan, periode }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kartu
          icon={TrendingDown}
          judul="Total Pengeluaran"
          nilai={formatRupiah(ringkasan.total)}
          keterangan={periode}
        />
        <Kartu
          icon={Receipt}
          judul="Jumlah Catatan"
          nilai={`${ringkasan.jumlah} catatan`}
          keterangan={periode}
        />
        <Kartu
          icon={Tag}
          judul="Kategori Terbesar"
          nilai={ringkasan.terbesar ? ringkasan.terbesar.kategori : "-"}
          keterangan={
            ringkasan.terbesar
              ? `${formatRupiah(ringkasan.terbesar.total)} (${ringkasan.terbesar.persen}%)`
              : "Belum ada pengeluaran"
          }
        />
      </div>

      {/* Langkah 6.3: rekap per kategori, panjang batang = persen dari total */}
      <div className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          Rekap per Kategori
        </h2>

        {ringkasan.perKategori.length === 0 ? (
          <p className="text-sm text-gray-500">
            Belum ada pengeluaran pada periode ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {ringkasan.perKategori.map((k) => (
              <div key={k.kategori}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">
                    {k.kategori}
                  </span>
                  <span className="text-gray-600">
                    {formatRupiah(k.total)}{" "}
                    <span className="text-xs text-gray-400">({k.persen}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-soft/50">
                  <div
                    className="h-2 rounded-full bg-secondary"
                    style={{ width: `${k.persen}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}