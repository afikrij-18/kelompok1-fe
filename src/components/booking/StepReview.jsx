// src/components/booking/StepReview.jsx
import { User, Snowflake, CalendarCheck, Receipt, ArrowLeft, BadgeCheck, Loader2, CreditCard, Building } from "lucide-react";
import {
  BIAYA_KUNJUNGAN,
  GARANSI_HARI,
  CATATAN_HARGA,
  METODE_PEMBAYARAN,
  BANK_OPTIONS,
} from "../../data/bookingOptions";
import {
  formatRupiah,
  formatDurasi,
  formatTanggalPanjang,
  hitungTotal,
  hitungDurasi,
  namaMerek,
} from "../../utils/booking";

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

export default function StepReview({
  customer,
  ringkasan,
  jadwal,
  teknisiNama,
  metodePembayaran,
  bank,
  setuju,
  errors,
  submitting,
  onMetodeChange,
  onBankChange,
  onSetuju,
  onBack,
  onUbahBooking,
  onSubmit,
}) {
  const subtotal = hitungTotal(ringkasan);
  const total = subtotal + BIAYA_KUNJUNGAN;
  const durasi = hitungDurasi(ringkasan);

  return (
    <div className="mx-auto max-w-5xl rounded-xl border border-soft bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-soft pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">2</span>
        <div>
          <h2 className="text-lg font-bold uppercase text-slate-900">Review, Pembayaran & Konfirmasi</h2>
          <p className="text-sm text-slate-600">Periksa kembali data pesanan, pilih metode pembayaran, dan konfirmasi.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Bagian icon={User} judul="Data Pelanggan & Lokasi" onUbah={onUbahBooking}>
          <p className="text-base font-bold text-primary">{customer.nama}</p>
          <p className="text-sm text-slate-800">WhatsApp: <strong>{customer.telepon}</strong></p>
          <p className="text-xs text-slate-600">{customer.alamat}</p>
        </Bagian>

        <Bagian icon={Snowflake} judul={`Rincian Unit AC (${ringkasan.length} Unit)`} onUbah={onUbahBooking}>
          {ringkasan.map((u, i) => (
            <div key={u.uid} className="rounded-lg border border-soft bg-white p-3">
              <p className="text-sm font-bold text-slate-900">
                <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Unit #{i + 1}</span>
                {u.layanan?.nama}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {namaMerek(u)} {u.kapasitas} ({u.tipe}) • Lokasi: {u.lokasi}
              </p>
              {u.catatan.trim() && <p className="text-xs italic text-slate-400">Keluhan: {u.catatan}</p>}
            </div>
          ))}
        </Bagian>

        <Bagian icon={CalendarCheck} judul="Jadwal & Teknisi Penugasan" onUbah={onUbahBooking}>
          <p className="text-base font-bold text-primary">
            {formatTanggalPanjang(jadwal.tanggal)} • Pukul {jadwal.jam} WIB
          </p>
          <p className="text-xs text-slate-600">
            Teknisi Ditugaskan: <strong className="text-slate-900">{teknisiNama}</strong> • Estimasi pengerjaan: ± {formatDurasi(durasi)}.
          </p>
        </Bagian>

        {/* Pilihan Metode Pembayaran */}
        <div className="rounded-xl border border-secondary/30 bg-soft/20 p-5">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard size={18} className="text-secondary" />
            PILIHAN METODE PEMBAYARAN <span className="text-red-600">*</span>
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {METODE_PEMBAYARAN.map((m) => {
              const dipilih = metodePembayaran === m.value;
              return (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                    dipilih
                      ? "border-primary bg-white shadow-md ring-2 ring-primary/20"
                      : "border-soft bg-white hover:bg-soft/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="metodePembayaran"
                    value={m.value}
                    checked={dipilih}
                    onChange={(e) => onMetodeChange(e.target.value)}
                    className="h-4 w-4 accent-[#2C5EAD]"
                  />
                  <span className="text-sm font-bold text-slate-900">{m.label}</span>
                </label>
              );
            })}
          </div>
          {errors.metodePembayaran && <p className="mt-2 text-xs text-red-600">{errors.metodePembayaran}</p>}

          {/* Opsi Bank jika memilih transfer */}
          {metodePembayaran === "transfer" && (
            <div className="mt-4 border-t border-soft pt-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-800">
                <Building size={16} className="text-primary" />
                PILIH BANK TUJUAN TRANSFER <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {BANK_OPTIONS.map((b) => {
                  const dipilih = bank === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => onBankChange(b.value)}
                      className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                        dipilih
                          ? "border-primary bg-primary text-white shadow"
                          : "border-soft bg-white text-slate-800 hover:bg-soft"
                      }`}
                    >
                      <span className="text-sm font-bold">{b.nama}</span>
                      <span className={`text-[11px] ${dipilih ? "text-white/90" : "text-slate-500"}`}>{b.rekening}</span>
                    </button>
                  );
                })}
              </div>
              {errors.bank && <p className="mt-2 text-xs text-red-600">{errors.bank}</p>}
            </div>
          )}
        </div>

        {/* Rincian Biaya */}
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

        {/* Persetujuan */}
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
          Kembali ke Form Booking
        </button>

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
