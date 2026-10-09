// src/components/booking/PembayaranSection.jsx
// Langkah 3: pilihan pembayaran di langkah review, "Belum dibayar" atau "Lunas sekarang"
import { Wallet } from "lucide-react";
import { METODE_OPSI } from "../../services/transactionMapper";
import { formatRupiah, inputClass } from "../../utils/booking";

// bayar = { status: "belum" | "lunas", metode: "cash" | ..., catatan: "" }
export default function PembayaranSection({ bayar, onChange, total }) {
  const ubah = (field, value) => onChange({ ...bayar, [field]: value });

  // Langkah 3.1: satu pilihan status pembayaran (kartu radio)
  const pilihan = (nilai, judul, keterangan) => (
    <label
      className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
        bayar.status === nilai ? "border-primary bg-primary/5" : "border-soft hover:bg-soft/30"
      }`}
    >
      <input
        type="radio"
        name="statusBayar"
        checked={bayar.status === nilai}
        onChange={() => ubah("status", nilai)}
        className="mt-1"
      />
      <span>
        <span className="block font-semibold text-slate-900">{judul}</span>
        <span className="block text-xs text-slate-600">{keterangan}</span>
      </span>
    </label>
  );

  return (
    <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-primary">
          <Wallet size={18} />
        </span>
        <div>
          <h2 className="text-lg font-bold uppercase text-slate-900">Pembayaran</h2>
          <p className="text-sm text-slate-600">Total tagihan {formatRupiah(total)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {pilihan("belum", "Belum dibayar", "Pembayaran dicatat nanti, setelah servis selesai.")}
        {pilihan("lunas", "Lunas sekarang", "Pembayaran penuh dicatat bersamaan dengan booking.")}
      </div>

      {/* Langkah 3.2: detail pembayaran, hanya tampil jika lunas */}
      {bayar.status === "lunas" && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="metodeBayar" className="mb-1 block text-xs font-bold text-slate-800">
              Metode Pembayaran
            </label>
            <select
              id="metodeBayar"
              value={bayar.metode}
              onChange={(e) => ubah("metode", e.target.value)}
              className={inputClass(false)}
            >
              {METODE_OPSI.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-800">Jumlah Dibayar</label>
            <input value={formatRupiah(total)} readOnly className={`${inputClass(false)} bg-slate-50`} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="catatanBayar" className="mb-1 block text-xs font-bold text-slate-800">
              Catatan <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <input
              id="catatanBayar"
              value={bayar.catatan}
              onChange={(e) => ubah("catatan", e.target.value)}
              placeholder="Contoh: transfer BCA a.n. pelanggan"
              className={inputClass(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}