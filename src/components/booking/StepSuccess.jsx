// src/components/booking/StepSuccess.jsx
// Langkah 11: langkah 5, booking berhasil dibuat
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { BIAYA_KUNJUNGAN } from "../../data/bookingOptions";
import { formatRupiah } from "../../utils/booking";

export default function StepSuccess({ hasil, onReset }) {
  const [tersalin, setTersalin] = useState(false);

  // Langkah 11.1: salin kode ke clipboard, gagal diabaikan (mis. izin ditolak)
  const salin = async () => {
    try {
      await navigator.clipboard.writeText(hasil.id);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2500);
    } catch {
      /* tidak ada tindakan */
    }
  };

  const total = hasil.items.reduce((j, it) => j + it.harga, 0) + BIAYA_KUNJUNGAN;
  const layananUnik = [...new Set(hasil.items.map((it) => it.layanan))].join(", ");

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-secondary/30 bg-white p-8 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-soft text-secondary ring-8 ring-soft/50">
        <CheckCircle2 size={44} />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900">BOOKING BERHASIL DIBUAT!</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
        Booking sudah tercatat dengan status Menunggu. Tugaskan teknisi melalui menu Jadwal & Dispatch.
      </p>

      <div className="mx-auto my-6 max-w-lg rounded-xl border border-primary/20 bg-soft/30 p-5">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Nomor Registrasi</span>
        <div className="my-2 flex items-center justify-center gap-3">
          <span className="font-mono text-3xl font-bold tracking-wider text-primary">{hasil.id}</span>
          <button
            type="button"
            onClick={salin}
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

      <div className="mx-auto mb-6 max-w-lg space-y-2 rounded-xl border border-soft p-4 text-left text-xs text-slate-600">
        <div className="flex justify-between gap-3 border-b border-soft pb-2">
          <span>Nama Pemesan:</span>
          <strong className="text-right text-slate-900">{hasil.pelanggan} ({hasil.telepon})</strong>
        </div>
        <div className="flex justify-between gap-3 border-b border-soft pb-2">
          <span>Jadwal Kedatangan:</span>
          <strong className="text-right text-slate-900">{hasil.jadwal} WIB</strong>
        </div>
        <div className="flex justify-between gap-3 border-b border-soft pb-2">
          <span>Unit Dilayani:</span>
          <strong className="text-right text-slate-900">{hasil.items.length} Unit AC ({layananUnik})</strong>
        </div>
        <div className="flex justify-between gap-3 pt-1">
          <span>Total Estimasi Biaya:</span>
          <strong className="text-base text-primary">{formatRupiah(total)}</strong>
        </div>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        {/* Langkah 11.2: tombol pertama ke dashboard admin */}
        <Link
          to="/dashboard"
          className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
        >
          Ke Dashboard
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-secondary px-5 py-2.5 text-sm font-bold text-secondary hover:bg-soft"
        >
          Buat Booking Baru
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Data belum tersimpan ke database dan belum muncul di tabel dashboard (masih data dummy).
      </p>
    </div>
  );
}