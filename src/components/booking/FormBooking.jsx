// src/components/booking/FormBooking.jsx
// Form gabungan untuk Langkah 1: Customer, Unit AC, Jadwal, dan Pilihan Teknisi
import { useState } from "react";
import {
  User,
  Smartphone,
  MapPin,
  ShieldCheck,
  Snowflake,
  Timer,
  Plus,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import UnitCard from "./UnitCard";
import { MAKS_UNIT, SLOT_JAM } from "../../data/bookingOptions";
import {
  inputClass,
  formatDurasi,
  hitungDurasi,
  hariIni,
  toISO,
  slotTerlewat,
  formatTanggalPanjang,
} from "../../utils/booking";

const HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function Field({ id, label, icon: Icon, error, hint, required = true, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-slate-800">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
        {children}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

function Kalender({ value, onSelect }) {
  const awal = value ? new Date(`${value}T00:00`) : new Date();
  const [bulan, setBulan] = useState({ y: awal.getFullYear(), m: awal.getMonth() });

  const today = hariIni();
  const sekarang = new Date();
  const bulanIni = bulan.y === sekarang.getFullYear() && bulan.m === sekarang.getMonth();

  const offset = (new Date(bulan.y, bulan.m, 1).getDay() + 6) % 7;
  const jumlahHari = new Date(bulan.y, bulan.m + 1, 0).getDate();
  const sel = [...Array(offset).fill(null), ...Array.from({ length: jumlahHari }, (_, i) => i + 1)];

  const geser = (n) => {
    const d = new Date(bulan.y, bulan.m + n, 1);
    setBulan({ y: d.getFullYear(), m: d.getMonth() });
  };

  const judul = new Date(bulan.y, bulan.m, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="rounded-xl border border-soft bg-soft/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold capitalize text-slate-900">
          <CalendarDays size={18} className="text-primary" />
          {judul}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={bulanIni}
            onClick={() => geser(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-soft bg-white hover:bg-soft disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => geser(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-soft bg-white hover:bg-soft"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold">
        {HARI.map((h) => (
          <span key={h} className={h === "Min" ? "text-red-500" : "text-slate-500"}>
            {h}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {sel.map((hari, i) => {
          if (hari === null) return <div key={`kosong-${i}`} />;

          const d = new Date(bulan.y, bulan.m, hari);
          const iso = toISO(d);
          const lewat = iso < today;
          const libur = d.getDay() === 0;
          const nonaktif = lewat || libur;
          const dipilih = iso === value;

          return (
            <button
              key={iso}
              type="button"
              disabled={nonaktif}
              onClick={() => onSelect(iso)}
              className={`flex h-12 flex-col items-center justify-center rounded-lg border text-sm transition-colors ${
                dipilih
                  ? "border-primary bg-primary font-bold text-white ring-2 ring-primary/40"
                  : nonaktif
                    ? "cursor-not-allowed border-transparent bg-soft/30 text-slate-300"
                    : "border-soft bg-white font-bold text-slate-800 hover:bg-soft"
              }`}
            >
              <span>{hari}</span>
              <span className={`text-[9px] font-normal ${libur && !lewat && !dipilih ? "text-red-500" : ""}`}>
                {dipilih ? "Dipilih" : libur && !lewat ? "Libur" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-soft pt-3 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-primary" /> Dipilih</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-slate-300" /> Tersedia</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-soft" /> Libur / Lewat</span>
      </div>
    </div>
  );
}

export default function FormBooking({
  customer,
  units,
  ringkasan,
  jadwal,
  teknisi,
  teknisiList,
  layananList,
  errors = {},
  peringatan = [],
  onCustomerChange,
  onUnitChange,
  onAddUnit,
  onRemoveUnit,
  onTanggalChange,
  onJamChange,
  onTeknisiChange,
}) {
  const durasi = hitungDurasi(ringkasan);

  return (
    <div className="space-y-6">
      {/* 1. DATA PELANGGAN */}
      <section className="rounded-xl border border-soft bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-soft pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">1</span>
          <div>
            <h2 className="text-base font-bold uppercase text-slate-900">Informasi Pelanggan</h2>
            <p className="text-xs text-slate-500">Isi data pemesan dan alamat lengkap pengerjaan.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field id="nama" label="Nama Lengkap" icon={User} error={errors.nama} hint="Nama pemesan atau kontak aktif di lokasi.">
            <input
              id="nama"
              name="nama"
              value={customer.nama}
              onChange={onCustomerChange}
              placeholder="Masukkan nama lengkap pelanggan"
              className={`${inputClass(errors.nama)} pl-10`}
            />
          </Field>

          <Field
            id="telepon"
            label="No. HP / WhatsApp"
            icon={Smartphone}
            error={errors.telepon}
            hint="Format: 10-15 digit angka. Teknisi akan menghubungi nomor ini."
          >
            <input
              id="telepon"
              name="telepon"
              type="tel"
              value={customer.telepon}
              onChange={onCustomerChange}
              placeholder="Contoh: 081234567890"
              className={`${inputClass(errors.telepon)} pl-10`}
            />
          </Field>

          {peringatan.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <ul className="space-y-1">
                {peringatan.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          <Field id="alamat" label="Alamat Lengkap Lokasi Service" icon={MapPin} error={errors.alamat}>
            <textarea
              id="alamat"
              name="alamat"
              rows={3}
              value={customer.alamat}
              onChange={onCustomerChange}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi..."
              className={`${inputClass(errors.alamat)} pl-10`}
            />
          </Field>

          <div className="flex items-start gap-2 rounded-lg bg-soft/30 p-3 text-xs text-slate-600">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-secondary" />
            <span>Data pelanggan tersimpan aman dan hanya digunakan untuk kebutuhan servis.</span>
          </div>
        </div>
      </section>

      {/* 2. UNIT AC & LAYANAN */}
      <section className="space-y-4">
        <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-soft pb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">2</span>
              <div>
                <h2 className="text-base font-bold uppercase text-slate-900">Daftar Unit AC & Jenis Layanan</h2>
                <p className="text-xs text-slate-500">Pilih layanan dan spesifikasi setiap unit AC (maksimal {MAKS_UNIT} unit).</p>
              </div>
            </div>
            {durasi > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-soft bg-soft/30 px-3 py-1.5 text-xs font-bold text-primary">
                <Timer size={15} />
                Estimasi Durasi: ± {formatDurasi(durasi)}
              </span>
            )}
          </div>
        </div>

        {units.map((u, i) => (
          <UnitCard
            key={u.uid}
            index={i}
            data={u}
            error={errors.units?.[u.uid]}
            canRemove={units.length > 1}
            layananList={layananList}
            onChange={(field, value) => onUnitChange(u.uid, field, value)}
            onRemove={() => onRemoveUnit(u.uid)}
          />
        ))}

        <button
          type="button"
          onClick={onAddUnit}
          disabled={units.length >= MAKS_UNIT}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary/50 bg-soft/20 py-3.5 text-sm font-bold text-secondary hover:border-secondary hover:bg-soft/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Tambah Unit AC ({units.length}/{MAKS_UNIT})
        </button>
      </section>

      {/* 3. JADWAL KEDATANGAN */}
      <section className="rounded-xl border border-soft bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-soft pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">3</span>
          <div>
            <h2 className="text-base font-bold uppercase text-slate-900">Jadwal Kedatangan</h2>
            <p className="text-xs text-slate-500">Tentukan tanggal dan jam kedatangan teknisi.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <Kalender value={jadwal.tanggal} onSelect={onTanggalChange} />
            {errors.tanggal && <p className="mt-2 text-xs text-red-600">{errors.tanggal}</p>}
          </div>

          <div className="md:col-span-5">
            <h3 className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-800">
              <Clock size={16} className="text-primary" />
              PILIH JAM KEDATANGAN <span className="text-red-600">*</span>
            </h3>
            <p className="mb-3 text-[11px] text-slate-500">Slot jam kedatangan teknisi ke lokasi.</p>

            <div className="grid grid-cols-2 gap-2">
              {SLOT_JAM.map((jam) => {
                const lewat = slotTerlewat(jadwal.tanggal, jam);
                const dipilih = jadwal.jam === jam;
                return (
                  <button
                    key={jam}
                    type="button"
                    disabled={lewat}
                    onClick={() => onJamChange(jam)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold ${
                      dipilih
                        ? "border-2 border-primary bg-soft text-primary"
                        : lewat
                          ? "cursor-not-allowed border-soft bg-soft/30 text-slate-300 line-through"
                          : "border-soft bg-white text-slate-700 hover:border-secondary"
                    }`}
                  >
                    <span>{jam} WIB</span>
                    {dipilih && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>
            {errors.jam && <p className="mt-2 text-xs text-red-600">{errors.jam}</p>}

            <div className="mt-4 rounded-xl border border-secondary/30 bg-soft/30 p-3">
              <p className="text-[10px] font-bold uppercase text-secondary">Jadwal Terpilih:</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {jadwal.tanggal && jadwal.jam
                  ? `${formatTanggalPanjang(jadwal.tanggal)} • ${jadwal.jam} WIB`
                  : "Belum menentukan tanggal & jam"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PENUGASAN TEKNISI (TAMBAHAN) */}
      <section className="rounded-xl border border-soft bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-soft pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">4</span>
          <div>
            <h2 className="text-base font-bold uppercase text-slate-900">Penugasan Teknisi (Opsional)</h2>
            <p className="text-xs text-slate-500">Pilih teknisi yang akan menangani servis AC ini langsung saat booking.</p>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="teknisi" className="mb-1 block text-xs font-bold text-slate-800">
            PILIH TEKNISI BERTUGAS
          </label>
          <div className="relative">
            <Wrench size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <select
              id="teknisi"
              value={teknisi}
              onChange={(e) => onTeknisiChange(e.target.value)}
              className={`${inputClass(false)} pl-10`}
            >
              <option value="">-- Belum Ditugaskan (Pilih Nanti di Dispatch) --</option>
              {teknisiList.map((t) => (
                <option key={t.id || t.nama} value={t.nama}>
                  {t.nama} {t.telepon ? `(${t.telepon})` : ""} - Status: {t.status || "Aktif"}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Anda dapat membiarkan kosong bila penugasan teknisi akan diatur kemudian dari menu jadwal.
          </p>
        </div>
      </section>
    </div>
  );
}
