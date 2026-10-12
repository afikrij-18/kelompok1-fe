// src/components/laporan/CetakLaporanDialog.jsx
// Langkah 3: dialog pilihan cetak, dipakai Laporan Penjualan dan Laporan Uang Keluar
import { useState } from "react";
import { X, Printer } from "lucide-react";

// Langkah 3.1: props
// judul    = judul dialog
// bagian   = [{ id, label, keterangan, ringkas? }], ringkas true = ikut pada tombol "Ringkasan saja"
// filter   = opsional { label, opsi: [{ value, label }] }, mis. pilihan kategori
// onCetak  = ({ bagian: [id], orientasi, filter }) => void
export default function CetakLaporanDialog({
  judul,
  bagian,
  filter,
  onCetak,
  onClose,
}) {
  const [terpilih, setTerpilih] = useState(bagian.map((b) => b.id));
  const [orientasi, setOrientasi] = useState("portrait");
  const [nilaiFilter, setNilaiFilter] = useState(
    filter ? filter.opsi[0].value : "",
  );
  const [error, setError] = useState("");

  const ubah = (id) => {
    setError("");
    setTerpilih((t) =>
      t.includes(id) ? t.filter((x) => x !== id) : [...t, id],
    );
  };

  // Langkah 3.2: dua pilihan cepat
  const ringkasSaja = () => {
    setError("");
    setTerpilih(bagian.filter((b) => b.ringkas).map((b) => b.id));
    setOrientasi("portrait");
  };
  const lengkap = () => {
    setError("");
    setTerpilih(bagian.map((b) => b.id));
  };

  const handleCetak = () => {
    if (terpilih.length === 0) {
      setError("Pilih minimal satu bagian yang akan dicetak.");
      return;
    }
    onCetak({ bagian: terpilih, orientasi, filter: nilaiFilter });
    onClose();
  };

  const pilihanKertas = (nilai, label, keterangan) => (
    <label
      className={`flex flex-1 cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
        orientasi === nilai
          ? "border-primary bg-primary/5"
          : "border-soft hover:bg-soft/30"
      }`}
    >
      <input
        type="radio"
        name="orientasi"
        checked={orientasi === nilai}
        onChange={() => setOrientasi(nilai)}
        className="mt-1"
      />
      <span>
        <span className="block font-semibold text-slate-900">{label}</span>
        <span className="block text-xs text-slate-500">{keterangan}</span>
      </span>
    </label>
  );

  return (
    // Langkah 3.3: area gelap tidak menutup dialog, hanya tombol Batal atau X
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">{judul}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Isi laporan</p>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={ringkasSaja}
                  className="font-bold text-secondary hover:underline"
                >
                  Ringkasan saja
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={lengkap}
                  className="font-bold text-secondary hover:underline"
                >
                  Lengkap
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {bagian.map((b) => (
                <li key={b.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 hover:bg-soft/30">
                    <input
                      type="checkbox"
                      checked={terpilih.includes(b.id)}
                      onChange={() => ubah(b.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">
                        {b.label}
                      </span>
                      {b.keterangan && (
                        <span className="block text-xs text-slate-500">
                          {b.keterangan}
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {filter && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                {filter.label}
              </label>
              <select
                value={nilaiFilter}
                onChange={(e) => setNilaiFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {filter.opsi.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium">Orientasi kertas (A4)</p>
            <div className="flex gap-2">
              {pilihanKertas("portrait", "Potret", "Cocok untuk ringkasan")}
              {pilihanKertas(
                "landscape",
                "Lanskap",
                "Cocok untuk rincian yang lebar",
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <p className="text-xs text-gray-400">
            Di jendela cetak, pilih printer atau "Simpan sebagai PDF".
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleCetak}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
            >
              <Printer size={16} />
              Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}