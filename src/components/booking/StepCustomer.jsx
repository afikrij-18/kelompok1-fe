// src/components/booking/StepCustomer.jsx
// Langkah 4: langkah 1, data pelanggan. Urutan: nomor HP, nama, alamat (pilih tersimpan atau baru)
import { User, Smartphone, MapPin, ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { inputClass } from "../../utils/booking";

// Langkah 4.1: satu baris field, label + ikon + pesan error atau petunjuk
function Field({ id, label, icon: Icon, error, hint, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-slate-800">
        {label}{" "}
        {optional ? (
          <span className="font-normal text-slate-400">(opsional)</span>
        ) : (
          <span className="text-red-600">*</span>
        )}
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

// Langkah 4.2: satu pilihan alamat (kartu radio)
function PilihanAlamat({ aktif, onPilih, judul, children }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
        aktif ? "border-primary bg-primary/5" : "border-soft hover:bg-soft/30"
      }`}
    >
      <input type="radio" name="alamatPilihan" checked={aktif} onChange={onPilih} className="mt-1" />
      <span>
        <span className="block font-semibold text-slate-900">{judul}</span>
        {children}
      </span>
    </label>
  );
}

// Langkah 4.3: props dari Booking.jsx
// dikenal      = pelanggan terdaftar dengan nomor yang diisi (atau undefined), punya alamatList
// onPilihAlamat = pilih alamat tersimpan (id) atau alamat baru ("")
// peringatan   = daftar teks dari cekPelanggan
// hideNavigation = sembunyikan tombol langkah sendiri jika dirangkai dalam step 1 gabungan
export default function StepCustomer({
  data,
  errors,
  onChange,
  onNext,
  labelNext,
  peringatan = [],
  dikenal,
  onPilihAlamat,
  hideNavigation = false,
}) {
  // Langkah 4.4: ada alamat tersimpan, dan apakah sedang mengisi alamat baru
  const punyaAlamat = Boolean(dikenal && dikenal.alamatList.length > 0);
  const alamatBaru = !punyaAlamat || data.addressId === "";

  return (
    <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">1</span>
          <div>
            <h2 className="text-lg font-bold uppercase text-slate-900">Data Pelanggan</h2>
            <p className="text-sm text-slate-600">Lengkapi data pelanggan untuk membuat booking service.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Langkah 4.5: nomor HP diisi lebih dulu */}
          <Field
            id="telepon"
            label="No. HP / WhatsApp"
            icon={Smartphone}
            error={errors.telepon}
            hint="Isi nomor lebih dulu. Jika sudah terdaftar, nama dan alamat tersimpan muncul otomatis."
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

          {dikenal && (
            <div className="flex items-start gap-2 rounded-lg border border-green-300 bg-green-50 p-3 text-xs text-green-800">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>
                Pelanggan terdaftar atas nama <strong>{dikenal.nama}</strong>. Nama terisi otomatis dan bisa diubah.
              </span>
            </div>
          )}

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

          {/* Langkah 4.6: pilih alamat tersimpan atau tambah alamat baru */}
          {punyaAlamat && (
            <div>
              <p className="mb-1 text-xs font-bold text-slate-800">
                Alamat Lokasi Service <span className="text-red-600">*</span>
              </p>
              <div className="space-y-2">
                {dikenal.alamatList.map((a) => (
                  <PilihanAlamat
                    key={a.id}
                    aktif={String(data.addressId) === String(a.id)}
                    onPilih={() => onPilihAlamat(a.id)}
                    judul={a.label}
                  >
                    <span className="block text-xs text-slate-600">{a.alamat}</span>
                    {a.catatan && <span className="block text-xs text-slate-400">{a.catatan}</span>}
                  </PilihanAlamat>
                ))}
                <PilihanAlamat aktif={data.addressId === ""} onPilih={() => onPilihAlamat("")} judul="Tambah alamat baru">
                  <span className="block text-xs text-slate-600">
                    Alamat ini disimpan sebagai alamat tambahan milik pelanggan.
                  </span>
                </PilihanAlamat>
              </div>
            </div>
          )}

          {/* Langkah 4.7: formulir alamat baru (pelanggan baru, atau memilih "Tambah alamat baru") */}
          {alamatBaru && (
            <>
              <Field
                id="labelAlamat"
                label="Label Alamat"
                icon={MapPin}
                optional
                hint='Contoh: "Rumah", "Kantor", "Toko". Kosong = "Alamat Utama".'
              >
                <input
                  id="labelAlamat"
                  name="labelAlamat"
                  value={data.labelAlamat}
                  onChange={onChange}
                  placeholder="Rumah"
                  className={`${inputClass(false)} pl-10`}
                />
              </Field>

              <Field id="alamat" label="Alamat Lengkap Lokasi Service" icon={MapPin} error={errors.alamat}>
                <textarea
                  id="alamat"
                  name="alamat"
                  rows={3}
                  value={data.alamat}
                  onChange={onChange}
                  placeholder="Nama jalan, nomor rumah, RT/RW"
                  className={`${inputClass(errors.alamat)} pl-10`}
                />
              </Field>

              <Field
                id="catatanLokasi"
                label="Patokan Lokasi"
                icon={MapPin}
                optional
                hint="Contoh: cat hijau dekat pos satpam."
              >
                <input
                  id="catatanLokasi"
                  name="catatanLokasi"
                  value={data.catatanLokasi}
                  onChange={onChange}
                  className={`${inputClass(false)} pl-10`}
                />
              </Field>
            </>
          )}

          {/* Langkah 4.8: peringatan pelanggan, tidak memblokir */}
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

          <div className="flex items-start gap-2 rounded-lg bg-soft/30 p-3 text-xs text-slate-600">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-secondary" />
            <span>Data pelanggan hanya digunakan untuk penjadwalan dan pengerjaan teknisi.</span>
          </div>
        </div>

        {!hideNavigation && (
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
        )}
      </div>
  );
}