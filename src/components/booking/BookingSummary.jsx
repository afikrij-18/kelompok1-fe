// src/components/booking/BookingSummary.jsx
// Langkah 7: ringkasan biaya di sisi kanan langkah 2
import { BadgeCheck } from "lucide-react";
import { BIAYA_KUNJUNGAN, GARANSI_HARI, INFO_PEMBAYARAN } from "../../data/bookingOptions";
import { formatRupiah, hitungTotal } from "../../utils/booking";

// Langkah 7.1: items = unit yang sudah digabung dengan objek layanan terpilih
export default function BookingSummary({ items }) {
  const total = hitungTotal(items) + BIAYA_KUNJUNGAN;

  return (
    <div className="rounded-xl border border-soft bg-white p-4 shadow-md">
      <div className="flex items-center justify-between border-b border-soft pb-3">
        <h3 className="text-sm font-bold text-slate-900">Ringkasan Unit</h3>
        <span className="text-xs font-bold text-secondary">{items.length} Unit AC</span>
      </div>

      <div className="space-y-2 border-b border-soft py-4 text-xs text-slate-600">
        {items.map((it, i) => (
          <div key={it.uid} className="flex items-start justify-between gap-2">
            <span>
              Unit #{i + 1} {it.layanan ? `(${it.layanan.nama})` : <em className="text-slate-400">belum memilih layanan</em>}
            </span>
            {it.layanan && <span className="shrink-0 font-bold text-slate-900">{formatRupiah(it.layanan.harga)}</span>}
          </div>
        ))}

        {/* Langkah 7.2: biaya kunjungan, tampil GRATIS jika 0 */}
        <div className="flex justify-between text-primary">
          <span>Biaya Kunjungan & Transport</span>
          <span className="font-bold">{BIAYA_KUNJUNGAN === 0 ? "GRATIS" : formatRupiah(BIAYA_KUNJUNGAN)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3">
        <div>
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Estimasi Awal</p>
          <p className="text-xl font-bold text-primary">{formatRupiah(total)}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded bg-soft px-2 py-1 text-[11px] font-bold text-secondary">
          <BadgeCheck size={14} />
          Garansi {GARANSI_HARI} Hari
        </span>
      </div>

      <p className="mt-3 rounded-lg bg-soft/30 p-2 text-center text-xs text-slate-500">{INFO_PEMBAYARAN}</p>
    </div>
  );
}