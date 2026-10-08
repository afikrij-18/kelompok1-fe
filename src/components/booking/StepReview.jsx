// src/components/booking/StepReview.jsx  (FE, DIGANTI seluruh isi)
// periksa semua data sebelum disimpan
import { User, Snowflake, CalendarCheck, Receipt, ArrowLeft, BadgeCheck, Loader2 } from "lucide-react";
import {
  BIAYA_KUNJUNGAN,
  TAMPILKAN_BIAYA_KUNJUNGAN,
  GARANSI_HARI,
  CATATAN_HARGA,
} from "../../data/bookingOptions";
import {
  formatRupiah,
  formatDurasi,
  formatTanggalPanjang,
  hitungTotal,
  hitungDurasi,
  namaMerek,
} from "../../utils/booking";

// Langkah 6.1: satu bagian review dengan tombol "Ubah"
function Bagian({ icon: Icon, judul, onUbah, children }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-soft bg-soft/20 p-4 sm:flex-row">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft text-primary">
          <Icon size={20} />
        </span>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900">{judul}</h4>
          {children}
        </div>
      </div>
      <button
        type="button"
        onClick={onUbah}
        className="shrink-0 rounded-lg border border-secondary/40 px-3 py-1.5 text-xs font-bold text-secondary hover:bg-soft"
      >
        Ubah
      </button>
    </div>
  );
}

export default function StepReview({ customer, ringkasan, jadwal, setuju, errors, submitting, onSetuju, onGo, onBack, onSubmit }) {
  const subtotal = hitungTotal(ringkasan);
  const total = subtotal + BIAYA_KUNJUNGAN;
  const durasi = hitungDurasi(ringkasan);

  return (
    <div className="mx-auto max-w-5xl rounded-xl border border-soft bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-soft pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">4</span>
        <div>
          <h2 className="text-lg font-bold uppercase text-slate-900">Review & Konfirmasi Booking</h2>
          <p className="text-sm text-slate-600">Periksa kembali data pelanggan, unit AC, dan jadwal.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Bagian icon={User} judul="Data Pelanggan & Lokasi" onUbah={() => onGo(1)}>
          <p className="text-base font-bold text-primary">{customer.nama}</p>
          <p className="text-sm text-slate-800">WhatsApp: <strong>{customer.telepon}</strong></p>
          <p className="text-xs text-slate-600">{customer.alamat}</p>
        </Bagian>

        <Bagian icon={Snowflake} judul={`Rincian Unit AC (${ringkasan.length} Unit)`} onUbah={() => onGo(2)}>
          {ringkasan.map((u, i) => (
            <div key={u.uid} className="rounded-lg border border-soft bg-white p-3">
              <p className="text-sm font-bold text-slate-900">
                <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Unit #{i + 1}</span>
                {u.layanan?.nama}
              </p>
              {/* Langkah 6.2: merek memakai tulisan pengguna jika memilih "Lainnya" */}
              <p className="mt-1 text-xs text-slate-600">
                {namaMerek(u)} {u.kapasitas} ({u.tipe}) • Lokasi: {u.lokasi}
              </p>
              {u.catatan.trim() && <p className="text-xs italic text-slate-400">Keluhan: {u.catatan}</p>}
            </div>
          ))}
        </Bagian>

        <Bagian icon={CalendarCheck} judul="Jadwal Kedatangan" onUbah={() => onGo(3)}>
          <p className="text-base font-bold text-primary">
            {formatTanggalPanjang(jadwal.tanggal)} • Pukul {jadwal.jam} WIB
          </p>
          <p className="text-xs text-slate-600">Estimasi pengerjaan {ringkasan.length} unit: ± {formatDurasi(durasi)}.</p>
        </Bagian>

        {/* Langkah 6.3: rincian biaya, baris opsional hanya tampil jika diaktifkan di bookingOptions.js */}
        <div className="rounded-xl border border-secondary/30 bg-soft/30 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Receipt size={18} className="text-secondary" />
            ESTIMASI BIAYA AKHIR
          </h4>
          <div className="space-y-1 border-b border-soft pb-3 text-sm text-slate-600">
            {ringkasan.map((u, i) => (
              <div key={u.uid} className="flex justify-between">
                <span>{u.layanan?.nama} (Unit #{i + 1})</span>
                <span className="font-bold text-slate-900">{formatRupiah(u.layanan?.harga ?? 0)}</span>
              </div>
            ))}

            {TAMPILKAN_BIAYA_KUNJUNGAN && (
              <div className="flex justify-between text-primary">
                <span>Biaya Kunjungan & Transport</span>
                <span className="font-bold">{BIAYA_KUNJUNGAN === 0 ? "GRATIS" : formatRupiah(BIAYA_KUNJUNGAN)}</span>
              </div>
            )}
            {GARANSI_HARI && (
              <div className="flex justify-between text-secondary">
                <span>Garansi {GARANSI_HARI} Hari Kalender</span>
                <span className="font-bold">Termasuk</span>
              </div>
            )}
          </div>

          <div className="pt-3">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Estimasi Pembayaran</span>
            <p className="text-2xl font-bold text-primary">{formatRupiah(total)}</p>
          </div>

          {CATATAN_HARGA && <p className="mt-2 text-xs italic text-slate-400">{CATATAN_HARGA}</p>}
        </div>

        {/* Langkah 6.4: persetujuan pelanggan wajib dicentang */}
        <div>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-soft p-3 text-xs text-slate-800">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => onSetuju(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#2C5EAD]"
            />
            <span>
              Pelanggan telah menyetujui syarat dan ketentuan booking serta bersedia dihubungi teknisi sebelum jadwal kedatangan.
            </span>
          </label>
          {errors.setuju && <p className="mt-1 text-xs text-red-600">{errors.setuju}</p>}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-soft pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-soft disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Kembali ke Jadwal
        </button>

        {/* Langkah 6.5: tombol nonaktif dan berputar saat menunggu respons */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? <Loader2 size={20} className="animate-spin" /> : <BadgeCheck size={20} />}
          {submitting ? "Memproses Booking..." : "KONFIRMASI BOOKING SEKARANG"}
        </button>
      </div>
    </div>
  );
}