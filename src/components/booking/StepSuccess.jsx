// src/components/booking/StepSuccess.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, Check, CreditCard, User, Calendar, Wrench, MapPin } from "lucide-react";
import { BIAYA_KUNJUNGAN, BANK_OPTIONS } from "../../data/bookingOptions";
import { formatRupiah } from "../../utils/booking";

export default function StepSuccess({ hasil, onReset }) {
  const [tersalin, setTersalin] = useState(false);

  const salin = async (teks) => {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2500);
    } catch {
      /* abaikan */
    }
  };

  const total = hasil.items.reduce((j, it) => j + it.harga, 0) + BIAYA_KUNJUNGAN;
  const bankTerpilih = BANK_OPTIONS.find((b) => b.value === hasil.bank);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-secondary/30 bg-white p-8 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-soft text-secondary ring-8 ring-soft/50">
        <CheckCircle2 size={44} />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900">BOOKING BERHASIL DIBUAT!</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
        Pesanan booking servis AC telah tercatat di dalam sistem dengan status <strong>{hasil.status}</strong>.
      </p>

      {/* Box No Registrasi */}
      <div className="mx-auto my-6 max-w-lg rounded-xl border border-primary/20 bg-soft/30 p-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Nomor Registrasi</span>
        <div className="my-2 flex items-center justify-center gap-3">
          <span className="font-mono text-3xl font-bold tracking-wider text-primary">{hasil.id}</span>
          <button
            type="button"
            onClick={() => salin(hasil.id)}
            title="Salin kode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-soft bg-white text-primary hover:bg-soft"
          >
            {tersalin ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className="text-xs font-semibold text-secondary">
          {tersalin ? `Kode ${hasil.id} berhasil disalin.` : "Berikan nomor registrasi ini kepada pelanggan."}
        </p>
      </div>

      {/* Info Transfer Bank jika metode Transfer */}
      {hasil.metodePembayaran === "transfer" && bankTerpilih && (
        <div className="mx-auto mb-6 max-w-lg rounded-xl border border-secondary/40 bg-secondary/5 p-4 text-left">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard size={18} className="text-secondary" />
            <span>Instruksi Transfer Bank ({bankTerpilih.nama})</span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-soft bg-white p-3">
            <div>
              <p className="text-xs text-slate-500">Nomor Rekening & Atas Nama</p>
              <p className="text-sm font-mono font-bold text-slate-900">{bankTerpilih.rekening}</p>
            </div>
            <button
              type="button"
              onClick={() => salin(bankTerpilih.rekening)}
              className="rounded-lg border border-soft px-3 py-1 text-xs font-bold text-primary hover:bg-soft"
            >
              Salin Rekening
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Silakan lakukan transfer sebesar <strong>{formatRupiah(total)}</strong>. Konfirmasi transfer dapat ditunjukkan ke teknisi saat kedatangan.
          </p>
        </div>
      )}

      {/* Rincian Detail Booking */}
      <div className="mx-auto mb-6 max-w-lg space-y-3 rounded-xl border border-soft p-5 text-left text-xs text-slate-600">
        <h3 className="font-bold uppercase tracking-wider text-slate-800">Detail Booking Servis AC</h3>

        <div className="flex items-start gap-2 border-b border-soft pb-2">
          <User size={16} className="mt-0.5 text-primary shrink-0" />
          <div className="flex-1 flex justify-between">
            <span>Pelanggan:</span>
            <strong className="text-right text-slate-900">{hasil.pelanggan} ({hasil.telepon})</strong>
          </div>
        </div>

        <div className="flex items-start gap-2 border-b border-soft pb-2">
          <MapPin size={16} className="mt-0.5 text-primary shrink-0" />
          <div className="flex-1 flex justify-between">
            <span>Alamat:</span>
            <span className="text-right font-medium text-slate-900 max-w-[260px] truncate">{hasil.alamat}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 border-b border-soft pb-2">
          <Calendar size={16} className="mt-0.5 text-primary shrink-0" />
          <div className="flex-1 flex justify-between">
            <span>Jadwal Kedatangan:</span>
            <strong className="text-right text-slate-900">{hasil.jadwal} WIB</strong>
          </div>
        </div>

        <div className="flex items-start gap-2 border-b border-soft pb-2">
          <Wrench size={16} className="mt-0.5 text-primary shrink-0" />
          <div className="flex-1 flex justify-between">
            <span>Teknisi Ditugaskan:</span>
            <strong className="text-right text-primary">{hasil.teknisi || "Belum Ditugaskan"}</strong>
          </div>
        </div>

        <div className="border-b border-soft pb-2">
          <p className="font-bold text-slate-800 mb-1">Daftar Unit AC ({hasil.items.length} Unit):</p>
          <ul className="space-y-1 pl-2">
            {hasil.items.map((it, idx) => (
              <li key={idx} className="flex justify-between text-slate-700">
                <span>Unit #{idx + 1} ({it.unit}) - {it.layanan}</span>
                <span className="font-bold">{formatRupiah(it.harga)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-1 text-sm">
          <span className="font-bold text-slate-800">Total Pembayaran:</span>
          <strong className="text-lg text-primary">{formatRupiah(total)}</strong>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <span>Metode Pembayaran:</span>
          <span className="font-semibold uppercase text-slate-800">
            {hasil.metodePembayaran === "transfer" ? `Transfer (${bankTerpilih?.nama || "Bank"})` : "Tunai / Cash"}
          </span>
        </div>
      </div>

      {/* Tombol Navigasi */}
      <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        <Link
          to="/booking"
          className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
        >
          Ke Daftar Booking
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-secondary px-5 py-2.5 text-sm font-bold text-secondary hover:bg-soft"
        >
          Buat Booking Baru
        </button>
      </div>
    </div>
  );
}
