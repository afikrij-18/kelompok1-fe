// src/components/booking/BookingSummary.jsx
// Ringkasan biaya di sisi kanan - samakan dengan Detail Booking:
// hijau = sudah dibayar, merah = belum dibayar, total = sisa tagihan
import { BadgeCheck } from "lucide-react";
import { BIAYA_KUNJUNGAN, GARANSI_HARI, INFO_PEMBAYARAN } from "../../data/bookingOptions";
import { formatRupiah, hitungTotal } from "../../utils/booking";

// items = unit yang sudah digabung dengan objek layanan terpilih
// tombol aksi dirender oleh parent lewat prop `action`
export default function BookingSummary({ items, action }) {
  const total = hitungTotal(items) + BIAYA_KUNJUNGAN;
  const sisa = Math.max(0, total - sudahDibayar);
  const lunasSemua = sisa === 0 && sudahDibayar > 0;

  // Tentukan status bayar per unit secara berurutan (konsisten dengan BookingDetail)
  let sisaTerbayar = sudahDibayar;
  const statusUnit = items.map((it) => {
    const harga = it.layanan ? it.layanan.harga : 0;
    const lunas = sisaTerbayar >= harga && harga > 0;
    sisaTerbayar = Math.max(0, sisaTerbayar - harga);
    return lunas;
  });

  return (
    <div className="rounded-xl border border-soft bg-white p-4 shadow-md">
      <div className="flex items-center justify-between border-b border-soft pb-3">
        <h3 className="text-sm font-bold text-slate-900">Ringkasan Biaya</h3>
        <span className="text-xs font-bold text-secondary">{items.length} Unit AC</span>
      </div>

      <div className="space-y-2 border-b border-soft py-4 text-xs">
        {items.map((it, i) => {
          const lunas = statusUnit[i];
          return (
            <div
              key={it.uid}
              className={`flex items-start justify-between gap-2 rounded-lg border px-2.5 py-2 ${
                lunas ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${lunas ? "bg-green-500" : "bg-red-500"}`} />
                Unit #{i + 1} {it.layanan ? `(${it.layanan.nama})` : <em className="text-slate-400">belum memilih layanan</em>}
              </span>
              {it.layanan && <span className="shrink-0 font-bold">{formatRupiah(it.layanan.harga)}</span>}
            </div>
          );
        })}

        <div className="flex justify-between text-primary">
          <span>Biaya Kunjungan & Transport</span>
          <span className="font-bold">{BIAYA_KUNJUNGAN === 0 ? "GRATIS" : formatRupiah(BIAYA_KUNJUNGAN)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" /> Sudah dibayar
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Belum dibayar
        </span>
      </div>

      <div className="pt-3">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Total tagihan</span>
          <span className="font-bold text-slate-900">{formatRupiah(total)}</span>
        </div>
        {sudahDibayar > 0 && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Sudah dibayar</span>
            <span className="font-bold text-green-700">{formatRupiah(sudahDibayar)}</span>
          </div>
        )}
        <div className="mt-2">
          <p className="text-[11px] font-bold uppercase text-slate-400">Sisa Tagihan Belum Dibayar</p>
          <p className={`text-xl font-bold ${lunasSemua ? "text-green-700" : sisa > 0 ? "text-red-600" : "text-primary"}`}>
            {sudahDibayar > 0 ? (lunasSemua ? "LUNAS (Rp 0)" : formatRupiah(sisa)) : formatRupiah(total)}
          </p>
        </div>
        {sudahDibayar === 0 && (
          <span className="mt-2 inline-flex items-center gap-1 rounded bg-soft px-2 py-1 text-[11px] font-bold text-secondary">
            <BadgeCheck size={14} />
            Garansi {GARANSI_HARI} Hari
          </span>
        )}
      </div>

      <p className="mt-3 rounded-lg bg-soft/30 p-2 text-center text-xs text-slate-500">{INFO_PEMBAYARAN}</p>

      {action && <div className="mt-4 border-t border-soft pt-4">{action}</div>}
    </div>
  );
}
