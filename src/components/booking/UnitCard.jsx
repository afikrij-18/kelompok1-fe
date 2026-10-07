// src/components/booking/UnitCard.jsx
// Langkah 6: kartu satu unit AC (layanan, spesifikasi, keluhan)
import { Trash2 } from "lucide-react";
import { MEREK, KAPASITAS, TIPE } from "../../data/bookingOptions";
import { formatRupiah, formatDurasi, inputClass } from "../../utils/booking";

const selectKecil =
  "w-full rounded border border-soft bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40";

// Langkah 6.1: onChange(field, value) dipanggil per field, onRemove menghapus unit ini
export default function UnitCard({ index, data, error = {}, canRemove, layananList, onChange, onRemove }) {
  // Langkah 6.2: kategori untuk mengelompokkan pilihan layanan
  const kategoriList = [...new Set(layananList.map((l) => l.kategori))];
  const dipilih = layananList.find((l) => String(l.id) === String(data.layananId));

  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${index === 0 ? "border-2 border-primary/40" : "border border-soft"}`}>
      <div className="flex items-center justify-between border-b border-soft pb-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold text-white ${index === 0 ? "bg-primary" : "bg-secondary"}`}>
            Unit #{index + 1}
            {index === 0 && " (Utama)"}
          </span>
          <span className="text-sm font-bold text-slate-800">Spesifikasi AC {index + 1}</span>
        </div>

        {/* Langkah 6.3: tombol hapus hanya jika unit lebih dari satu */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-100"
          >
            <Trash2 size={14} />
            Hapus Unit
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {/* Layanan */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-800">
            1. JENIS LAYANAN <span className="text-red-600">*</span>
          </label>
          <select
            value={data.layananId}
            onChange={(e) => onChange("layananId", e.target.value)}
            className={inputClass(error.layananId)}
          >
            <option value="">-- Pilih layanan --</option>
            {kategoriList.map((k) => (
              <optgroup key={k} label={k}>
                {layananList
                  .filter((l) => l.kategori === k)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nama} - {formatRupiah(l.harga)}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {error.layananId && <p className="mt-1 text-xs text-red-600">{error.layananId}</p>}

          {/* Langkah 6.4: info layanan terpilih */}
          {dipilih && (
            <p className="mt-1 text-xs text-slate-500">
              {dipilih.deskripsi} | Estimasi {formatDurasi(dipilih.durasi)}
            </p>
          )}
        </div>

        {/* Spesifikasi */}
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-800">2. DETAIL SPESIFIKASI UNIT AC</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="mb-1 block text-[11px] text-slate-400">Merek AC</span>
              <select value={data.merek} onChange={(e) => onChange("merek", e.target.value)} className={selectKecil}>
                {MEREK.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-slate-400">Kapasitas (PK)</span>
              <select value={data.kapasitas} onChange={(e) => onChange("kapasitas", e.target.value)} className={selectKecil}>
                {KAPASITAS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-slate-400">Tipe Unit</span>
              <select value={data.tipe} onChange={(e) => onChange("tipe", e.target.value)} className={selectKecil}>
                {TIPE.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-slate-400">Lokasi Ruangan *</span>
              <input
                value={data.lokasi}
                onChange={(e) => onChange("lokasi", e.target.value)}
                placeholder="Kamar Tidur Utama"
                className={`${selectKecil} ${error.lokasi ? "border-red-500" : ""}`}
              />
              {error.lokasi && <p className="mt-1 text-xs text-red-600">{error.lokasi}</p>}
            </div>
          </div>

          {/* Langkah 3.1: kolom tulis merek, hanya muncul saat memilih "Lainnya" */}
          {data.merek === "Lainnya" && (
            <div className="mt-3 md:w-1/2">
              <span className="mb-1 block text-[11px] text-slate-400">Tulis Merek AC *</span>
              <input
                value={data.merekLain}
                onChange={(e) => onChange("merekLain", e.target.value)}
                placeholder="Contoh: Toshiba"
                className={`${selectKecil} ${error.merekLain ? "border-red-500" : ""}`}
              />
              {error.merekLain && <p className="mt-1 text-xs text-red-600">{error.merekLain}</p>}
            </div>
          )}
        </div>

        {/* Keluhan */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-800">3. KELUHAN / CATATAN KHUSUS</label>
          <textarea
            rows={2}
            value={data.catatan}
            onChange={(e) => onChange("catatan", e.target.value)}
            placeholder="Contoh: AC kurang dingin dan hembusan angin berdebu"
            className={inputClass(false)}
          />
        </div>
      </div>
    </div>
  );
}