// src/components/booking/StepCustomer.jsx
// Langkah 5: langkah 1, data pelanggan
import { User, Smartphone, MapPin, ShieldCheck, Layers, ArrowRight, AlertTriangle } from "lucide-react";
import { JAMINAN, MAKS_UNIT } from "../../data/bookingOptions";
import { inputClass } from "../../utils/booking";

// Langkah 5.1: satu baris field, label + ikon + pesan error atau petunjuk
function Field({ id, label, icon: Icon, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-slate-800">
        {label} <span className="text-red-600">*</span>
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

// Langkah 5.2: onChange menerima event input, dari Booking.jsx
// peringatan = daftar teks dari cekPelanggan (nomor HP atau nama yang sudah terdaftar)
export default function StepCustomer({ data, errors, onChange, onNext, labelNext, peringatan = [] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
      <div className="rounded-xl border border-soft bg-white p-6 shadow-sm lg:col-span-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">1</span>
          <div>
            <h2 className="text-lg font-bold uppercase text-slate-900">Data Pelanggan</h2>
            <p className="text-sm text-slate-600">Lengkapi data pelanggan untuk membuat booking service.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Field id="nama" label="Nama Lengkap" icon={User} error={errors.nama} hint="Nama pemesan atau kontak aktif di lokasi.">
            <input
              id="nama"
              name="nama"
              value={data.nama}
              onChange={onChange}
              placeholder="Masukkan nama lengkap"
              className={`${inputClass(errors.nama)} pl-10`}
            />
          </Field>

          <Field
            id="telepon"
            label="No. HP / WhatsApp"
            icon={Smartphone}
            error={errors.telepon}
            hint="Teknisi akan menghubungi lewat WhatsApp untuk konfirmasi."
          >
            <input
              id="telepon"
              name="telepon"
              type="tel"
              value={data.telepon}
              onChange={onChange}
              placeholder="Contoh: 081234567890"
              className={`${inputClass(errors.telepon)} pl-10`}
            />
          </Field>

          {/* Langkah 5.4: peringatan pelanggan sudah terdaftar, tidak memblokir */}
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
              value={data.alamat}
              onChange={onChange}
              placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
              className={`${inputClass(errors.alamat)} pl-10`}
            />
          </Field>

          <div className="flex items-start gap-2 rounded-lg bg-soft/30 p-3 text-xs text-slate-600">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-secondary" />
            <span>Data pelanggan hanya digunakan untuk penjadwalan dan pengerjaan teknisi.</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-soft pt-4">
          <span className="text-xs text-slate-400">Langkah 1 dari 4</span>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
          >
            {labelNext || "Lanjutkan ke Unit AC"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Langkah 5.3: kartu samping */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-xl border border-soft bg-soft/30 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck size={18} className="text-primary" />
            Jaminan Layanan
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {JAMINAN.map((j) => (
              <li key={j} className="flex items-start gap-2">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>{j}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
          <Layers size={28} className="mx-auto mb-1 text-primary" />
          <p className="text-sm font-bold text-slate-900">Booking Multi-Unit</p>
          <p className="mt-1 text-xs text-slate-600">
            Pelanggan punya lebih dari 1 AC? Daftarkan sampai {MAKS_UNIT} unit sekaligus pada langkah berikutnya.
          </p>
        </div>
      </div>
    </div>
  );
}