// src/components/booking/StepReview.jsx  (FE, DIGANTI seluruh isi)
// periksa semua data sebelum disimpan
import {
  User,
  Snowflake,
  CalendarCheck,
  Receipt,
  ArrowLeft,
  BadgeCheck,
  Loader2,
  Wrench,
  Wallet,
} from "lucide-react";
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
  inputClass,
} from "../../utils/booking";
import { METODE_OPSI } from "../../services/transactionMapper";

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

export default function StepReview({
  customer,
  ringkasan,
  jadwal,
  teknisi,
  teknisiList,
  bayar,
  onBayarChange,
  setuju,
  errors,
  submitting,
  onSetuju,
  onGo,
  onBack,
  onSubmit,
  sudahDibayar = 0,
}) {
  const subtotal = hitungTotal(ringkasan);
  const total = subtotal + BIAYA_KUNJUNGAN;
  const durasi = hitungDurasi(ringkasan);
  const sisa = total - sudahDibayar;

  const ubahBayar = (field, value) => onBayarChange({ ...bayar, [field]: value });

  const pilihanBayar = (nilai, judul, keterangan) => (
    <label
      key={nilai}
      className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
        bayar.status === nilai ? "border-primary bg-primary/5" : "border-soft hover:bg-soft/30"
      }`}
    >
      <input
        type="radio"
        name="statusBayar"
        checked={bayar.status === nilai}
        onChange={() => ubahBayar("status", nilai)}
        className="mt-1"
      />
      <span>
        <span className="block font-semibold text-slate-900">{judul}</span>
        <span className="block text-xs text-slate-600">{keterangan}</span>
      </span>
    </label>
  );

  return (
    <div className="mx-auto max-w-5xl rounded-xl border border-soft bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-soft pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">
          2
        </span>
        <div>
          <h2 className="text-lg font-bold uppercase text-slate-900">
            Review, Penugasan & Pembayaran
          </h2>
          <p className="text-sm text-slate-600">
            Periksa rincian booking, tetapkan teknisi, dan pilih opsi pembayaran.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Bagian
          icon={User}
          judul="Data Pelanggan & Lokasi"
          onUbah={() => onGo(1)}
        >
          <p className="text-base font-bold text-primary">{customer.nama}</p>
          <p className="text-sm text-slate-800">
            WhatsApp: <strong>{customer.telepon}</strong>
          </p>
          <p className="text-xs text-slate-600">{customer.alamat}</p>
          {customer.catatanLokasi && (
            <p className="text-xs text-slate-400">Patokan: {customer.catatanLokasi}</p>
          )}
        </Bagian>

        <Bagian
          icon={Snowflake}
          judul={`Rincian Unit AC (${ringkasan.length} Unit)`}
          onUbah={() => onGo(1)}
        >
          {ringkasan.map((u, i) => (
            <div
              key={u.uid}
              className="rounded-lg border border-soft bg-white p-3"
            >
              <p className="text-sm font-bold text-slate-900">
                <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                  Unit #{i + 1}
                </span>
                {u.layanan?.nama}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {namaMerek(u)} {u.kapasitas} ({u.tipe}) • Lokasi: {u.lokasi}
              </p>
              {u.catatan.trim() && (
                <p className="text-xs italic text-slate-400">
                  Keluhan: {u.catatan}
                </p>
              )}
            </div>
          ))}
        </Bagian>

        <Bagian
          icon={CalendarCheck}
          judul="Jadwal & Teknisi Bertugas"
          onUbah={() => onGo(1)}
        >
          <p className="text-base font-bold text-primary">
            {formatTanggalPanjang(jadwal.tanggal)} • Pukul {jadwal.jam} WIB
          </p>
          <p className="text-xs text-slate-600">
            Estimasi pengerjaan {ringkasan.length} unit: ± {formatDurasi(durasi)}.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Wrench size={16} className="text-secondary" />
            <span className="text-xs font-bold text-slate-800">Teknisi:</span>
            <span className="text-xs font-semibold text-primary">
              {teknisi ? teknisi.nama : "Belum ditentukan (Bisa ditugaskan nanti)"}
            </span>
          </div>
        </Bagian>

        {/* Bagian Pembayaran di Langkah 2 */}
        <div className="rounded-xl border border-soft bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-primary">
              <Wallet size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold uppercase text-slate-900">Pembayaran</h3>
              <p className="text-xs text-slate-600">
                {sudahDibayar > 0 ? (
                  <>Sudah dibayar {formatRupiah(sudahDibayar)} • Sisa tagihan {sisa > 0 ? formatRupiah(sisa) : "LUNAS"}</>
                ) : (
                  <>Total tagihan {formatRupiah(total)}</>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {pilihanBayar("belum", "Belum dibayar", sisa > 0 && sudahDibayar > 0 ? `Sisa ${formatRupiah(sisa)} dicatat nanti.` : "Pembayaran dicatat nanti setelah servis.")}
            {pilihanBayar("lunas", sisa > 0 && sudahDibayar > 0 ? "Lunasi sisa sekarang" : "Lunas sekarang", sisa > 0 && sudahDibayar > 0 ? `Catat pelunasan sisa ${formatRupiah(sisa)}.` : "Catat pelunasan pembayaran sekarang.")}
          </div>

          {bayar.status === "lunas" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="metodeBayar" className="mb-1 block text-xs font-bold text-slate-800">
                  Metode Pembayaran
                </label>
                <select
                  id="metodeBayar"
                  value={bayar.metode}
                  onChange={(e) => ubahBayar("metode", e.target.value)}
                  className={inputClass(false)}
                >
                  {METODE_OPSI.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Pilihan Bank jika metode transfer_bank */}
              {bayar.metode === "transfer_bank" && (
                <div>
                  <label htmlFor="pilihanBank" className="mb-1 block text-xs font-bold text-slate-800">
                    Pilihan Bank
                  </label>
                  <select
                    id="pilihanBank"
                    value={bayar.bank || "BCA"}
                    onChange={(e) => ubahBayar("bank", e.target.value)}
                    className={inputClass(false)}
                  >
                    <option value="BCA">BCA (1234567890 a.n. ServisAC)</option>
                    <option value="Mandiri">Mandiri (0987654321 a.n. ServisAC)</option>
                    <option value="BNI">BNI (1122334455 a.n. ServisAC)</option>
                    <option value="BRI">BRI (5544332211 a.n. ServisAC)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Jumlah Dibayar</label>
                <input
                  value={formatRupiah(sisa > 0 ? sisa : total)}
                  readOnly
                  className={`${inputClass(false)} bg-slate-50`}
                />
                {sudahDibayar > 0 && sisa > 0 && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    * Sesuai sisa tagihan tambahan (Total {formatRupiah(total)} - Terbayar {formatRupiah(sudahDibayar)})
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="catatanBayar" className="mb-1 block text-xs font-bold text-slate-800">
                  Catatan <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <input
                  id="catatanBayar"
                  value={bayar.catatan}
                  onChange={(e) => ubahBayar("catatan", e.target.value)}
                  placeholder="Contoh: transfer via BCA a.n. pelanggan"
                  className={inputClass(false)}
                />
              </div>
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
                <span>
                  {u.layanan?.nama} (Unit #{i + 1})
                </span>
                <span className="font-bold text-slate-900">
                  {formatRupiah(u.layanan?.harga ?? 0)}
                </span>
              </div>
            ))}

            {TAMPILKAN_BIAYA_KUNJUNGAN && (
              <div className="flex justify-between text-primary">
                <span>Biaya Kunjungan & Transport</span>
                <span className="font-bold">
                  {BIAYA_KUNJUNGAN === 0
                    ? "GRATIS"
                    : formatRupiah(BIAYA_KUNJUNGAN)}
                </span>
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-400">Total Keseluruhan</span>
              <span className="text-xl font-bold text-primary">{formatRupiah(total)}</span>
            </div>

            {sudahDibayar > 0 && (
              <div className="mt-2 space-y-1 rounded-lg bg-white p-3 text-xs border border-soft">
                <div className="flex justify-between text-slate-600">
                  <span>Sudah Dibayar</span>
                  <span className="font-bold text-green-700">{formatRupiah(sudahDibayar)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-soft pt-1">
                  <span className="text-slate-800">Sisa Tagihan Tambahan</span>
                  <span className={sisa > 0 ? "text-primary text-sm" : "text-green-700"}>
                    {sisa > 0 ? formatRupiah(sisa) : "LUNAS"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {CATATAN_HARGA && (
            <p className="mt-2 text-xs italic text-slate-400">
              {CATATAN_HARGA}
            </p>
          )}
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
          {errors.setuju && (
            <p className="mt-1 text-xs text-red-600">{errors.setuju}</p>
          )}
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
          Kembali ke Detail Booking
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <BadgeCheck size={20} />
          )}
          {submitting ? "Memproses Booking..." : "KONFIRMASI BOOKING SEKARANG"}
        </button>
      </div>
    </div>
  );
}
