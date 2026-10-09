// src/components/pengaturan/PengaturanUsaha.jsx
// Langkah 1: tiga tab pengaturan yang masih desain saja (Usaha, Booking, Notifikasi).
// Belum ada backend, jadi nilai hanya disimpan di layar dan tombol Simpan dikunci.
import { useState } from "react";
import { Store, CalendarCheck, Bell, Info } from "lucide-react";
import { MAKS_UNIT } from "../../data/bookingOptions";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

// Langkah 1.1: banner pemberitahuan di setiap tab desain
function BannerDesain() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
      <Info size={18} className="mt-0.5 shrink-0" />
      <span>
        Tampilan saja. Pengaturan ini belum tersambung ke server, jadi belum
        bisa disimpan. Nilai di layar hanya contoh.
      </span>
    </div>
  );
}

// Langkah 1.2: kartu pembungkus satu kelompok pengaturan
function Kartu({ icon: Icon, judul, keterangan, children }) {
  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-primary">
          <Icon size={22} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-primary">{judul}</h2>
          <p className="text-xs text-gray-500">{keterangan}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Bidang({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// Langkah 1.3: saklar aktif atau mati
function Saklar({ aktif, onChange, label, keterangan }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {keterangan && <p className="text-xs text-gray-500">{keterangan}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={aktif}
        onClick={() => onChange(!aktif)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${aktif ? "bg-secondary" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            aktif ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

// Langkah 1.4: tombol simpan yang dikunci sampai backend siap
function TombolSimpan() {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        disabled
        title="Menunggu backend"
        className="cursor-not-allowed rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white opacity-50"
      >
        Simpan (menunggu backend)
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- Tab Usaha
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function TabUsaha() {
  const [usaha, setUsaha] = useState({
    nama: "SejukPro",
    slogan: "AC Service & Booking",
    whatsapp: "",
    email: "",
    alamat: "",
  });
  // Langkah 1.5: jam operasional per hari, Minggu libur sebagai contoh
  const [jam, setJam] = useState(
    HARI.map((hari) => ({
      hari,
      aktif: hari !== "Minggu",
      buka: "08:00",
      tutup: "17:00",
    })),
  );

  const ubah = (e) => setUsaha({ ...usaha, [e.target.name]: e.target.value });
  const ubahJam = (i, field, nilai) =>
    setJam(jam.map((j, idx) => (idx === i ? { ...j, [field]: nilai } : j)));

  return (
    <div className="space-y-6">
      <BannerDesain />

      <Kartu
        icon={Store}
        judul="Informasi Usaha"
        keterangan="Tampil di homepage, invoice, dan pesan ke pelanggan."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Bidang label="Nama Usaha">
            <input
              name="nama"
              value={usaha.nama}
              onChange={ubah}
              className={inputClass}
            />
          </Bidang>
          <Bidang label="Keterangan Singkat">
            <input
              name="slogan"
              value={usaha.slogan}
              onChange={ubah}
              className={inputClass}
            />
          </Bidang>
          <Bidang
            label="No. WhatsApp Usaha"
            hint="Dipakai untuk notifikasi dan tombol hubungi di homepage."
          >
            <input
              name="whatsapp"
              value={usaha.whatsapp}
              onChange={ubah}
              placeholder="081234567890"
              className={inputClass}
            />
          </Bidang>
          <Bidang label="Email Usaha">
            <input
              name="email"
              type="email"
              value={usaha.email}
              onChange={ubah}
              placeholder="halo@sejukpro.com"
              className={inputClass}
            />
          </Bidang>
          <div className="md:col-span-2">
            <Bidang label="Alamat Usaha">
              <textarea
                name="alamat"
                rows={2}
                value={usaha.alamat}
                onChange={ubah}
                className={inputClass}
              />
            </Bidang>
          </div>
          <div className="md:col-span-2">
            <Bidang label="Logo" hint="Format PNG atau JPG, maksimal 2 MB.">
              <input
                type="file"
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400"
              />
            </Bidang>
          </div>
        </div>
      </Kartu>

      <Kartu
        icon={Store}
        judul="Jam Operasional"
        keterangan="Dipakai sebagai batas jam yang bisa dipilih pada jadwal booking."
      >
        <ul className="divide-y divide-gray-100">
          {jam.map((j, i) => (
            <li key={j.hari} className="flex flex-wrap items-center gap-3 py-2">
              <span className="w-20 text-sm font-medium">{j.hari}</span>
              <div className="w-40">
                <Saklar
                  aktif={j.aktif}
                  onChange={(v) => ubahJam(i, "aktif", v)}
                  label={j.aktif ? "Buka" : "Libur"}
                />
              </div>
              <input
                type="time"
                value={j.buka}
                disabled={!j.aktif}
                onChange={(e) => ubahJam(i, "buka", e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400"
              />
              <span className="text-sm text-gray-400">sampai</span>
              <input
                type="time"
                value={j.tutup}
                disabled={!j.aktif}
                onChange={(e) => ubahJam(i, "tutup", e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-50 disabled:text-gray-400"
              />
            </li>
          ))}
        </ul>
      </Kartu>

      <TombolSimpan />
    </div>
  );
}

// -------------------------------------------------------------- Tab Booking
export function TabBooking() {
  const [aturan, setAturan] = useState({
    maksUnit: String(MAKS_UNIT),
    autoCancel: "24",
    jedaMinimal: "1",
    garansi: "30",
  });
  const [autoCancelAktif, setAutoCancelAktif] = useState(true);

  const ubah = (e) => setAturan({ ...aturan, [e.target.name]: e.target.value });

  return (
    <div className="space-y-6">
      <BannerDesain />

      <Kartu
        icon={CalendarCheck}
        judul="Aturan Booking"
        keterangan="Batas yang berlaku saat admin membuat booking."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Bidang
            label="Maksimal Unit AC per Booking"
            hint="Jumlah unit yang bisa didaftarkan dalam satu pemesanan."
          >
            <input
              name="maksUnit"
              type="number"
              min="1"
              value={aturan.maksUnit}
              onChange={ubah}
              className={inputClass}
            />
          </Bidang>
          <Bidang
            label="Jeda Minimal Sebelum Jadwal (jam)"
            hint="Jam pada hari ini yang kurang dari jeda ini tidak bisa dipilih."
          >
            <input
              name="jedaMinimal"
              type="number"
              min="0"
              value={aturan.jedaMinimal}
              onChange={ubah}
              className={inputClass}
            />
          </Bidang>
          <Bidang
            label="Masa Garansi Pengerjaan (hari)"
            hint="Tampil di invoice dan halaman jaminan layanan."
          >
            <input
              name="garansi"
              type="number"
              min="0"
              value={aturan.garansi}
              onChange={ubah}
              className={inputClass}
            />
          </Bidang>
        </div>

        <div className="border-t border-gray-100 pt-2">
          <Saklar
            aktif={autoCancelAktif}
            onChange={setAutoCancelAktif}
            label="Batalkan otomatis booking yang belum dikonfirmasi"
            keterangan="Booking berstatus Menunggu dibatalkan setelah batas waktu di bawah."
          />
          <div className="mt-2 max-w-xs">
            <Bidang label="Batas Waktu (jam)">
              <input
                name="autoCancel"
                type="number"
                min="1"
                disabled={!autoCancelAktif}
                value={aturan.autoCancel}
                onChange={ubah}
                className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
              />
            </Bidang>
          </div>
        </div>
      </Kartu>

      <TombolSimpan />
    </div>
  );
}

// ---------------------------------------------------------- Tab Notifikasi
export function TabNotifikasi() {
  const [aktif, setAktif] = useState({
    dibuat: true,
    dikonfirmasi: true,
    pengingat: true,
    selesai: false,
  });
  const [template, setTemplate] = useState(
    "Halo {nama}, booking {kode} untuk {jadwal} sudah kami terima. Terima kasih telah memilih SejukPro.",
  );

  const ubah = (kunci) => (nilai) => setAktif({ ...aktif, [kunci]: nilai });

  return (
    <div className="space-y-6">
      <BannerDesain />

      <Kartu
        icon={Bell}
        judul="Notifikasi WhatsApp"
        keterangan="Pesan otomatis yang dikirim ke pelanggan."
      >
        <div className="divide-y divide-gray-100">
          <Saklar
            aktif={aktif.dibuat}
            onChange={ubah("dibuat")}
            label="Saat booking dibuat"
            keterangan="Konfirmasi bahwa pesanan sudah diterima."
          />
          <Saklar
            aktif={aktif.dikonfirmasi}
            onChange={ubah("dikonfirmasi")}
            label="Saat booking dikonfirmasi"
            keterangan="Berisi jadwal dan teknisi yang bertugas."
          />
          <Saklar
            aktif={aktif.pengingat}
            onChange={ubah("pengingat")}
            label="Pengingat satu hari sebelum jadwal"
          />
          <Saklar
            aktif={aktif.selesai}
            onChange={ubah("selesai")}
            label="Saat servis selesai"
            keterangan="Berisi ringkasan pekerjaan dan masa garansi."
          />
        </div>

        <Bidang
          label="Template Pesan Booking Dibuat"
          hint="Kode yang bisa dipakai: {nama}, {kode}, {jadwal}, {total}."
        >
          <textarea
            rows={4}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className={inputClass}
          />
        </Bidang>
      </Kartu>

      <TombolSimpan />
    </div>
  );
}