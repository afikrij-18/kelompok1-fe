// src/pages/PesanService.jsx
// Langkah 5: form booking untuk pelanggan (publik). Berbeda dari form admin:
// tanpa pencarian pelanggan, teknisi, dan pembayaran; status booking selalu Menunggu.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Snowflake, CheckCircle2 } from "lucide-react";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import {
  getPublicServices,
  createPublicBooking,
} from "../services/publicService";
import { MAKS_UNIT } from "../data/bookingOptions";
import {
  formatJadwal,
  formatRupiah,
  hitungDurasi,
  hitungTotal,
  namaMerek,
  slotTerlewat,
} from "../utils/booking";

const customerKosong = {
  nama: "",
  telepon: "",
  addressId: "",
  alamat: "",
  labelAlamat: "",
  catatanLokasi: "",
};
const jadwalKosong = { tanggal: "", jam: "" };

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Coba lagi beberapa saat lagi."
    : err.message;

export default function PesanService() {
  const [customer, setCustomer] = useState(customerKosong);
  const [jadwal, setJadwal] = useState(jadwalKosong);
  const [setuju, setSetuju] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [gagalKirim, setGagalKirim] = useState("");
  const [hasil, setHasil] = useState(null);

  const [layananList, setLayananList] = useState([]);
  const [gagalLayanan, setGagalLayanan] = useState("");

  // Langkah 5.1: kolom jebakan untuk robot pengisi formulir, orang sungguhan tidak melihatnya
  const [jebakan, setJebakan] = useState("");

  useEffect(() => {
    getPublicServices()
      .then(setLayananList)
      .catch((err) => setGagalLayanan(pesanError(err)));
  }, []);

  const uidRef = useRef(1);
  const unitBaru = () => ({
    uid: uidRef.current++,
    merek: "Daikin",
    merekLain: "",
    kapasitas: "1 PK",
    tipe: "Split Wall",
    lokasi: "",
    layananId: "",
    catatan: "",
  });
  const [units, setUnits] = useState(() => [unitBaru()]);

  const topRef = useRef(null);

  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));
  const teleponBersih = customer.telepon.replace(/[\s-]/g, "");

  const handleCustomer = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleUnit = (uid, field, value) => {
    setUnits(units.map((u) => (u.uid === uid ? { ...u, [field]: value } : u)));
    setErrors({
      ...errors,
      units: {
        ...errors.units,
        [uid]: { ...errors.units?.[uid], [field]: "" },
      },
    });
  };

  const addUnit = () => {
    if (units.length < MAKS_UNIT) setUnits([...units, unitBaru()]);
  };
  const removeUnit = (uid) => setUnits(units.filter((u) => u.uid !== uid));

  const handleTanggal = (iso) => {
    setJadwal((j) => ({
      tanggal: iso,
      jam: slotTerlewat(iso, j.jam) ? "" : j.jam,
    }));
    setErrors({ ...errors, tanggal: "", jam: "" });
  };
  const handleJam = (jam) => {
    setJadwal({ ...jadwal, jam });
    setErrors({ ...errors, jam: "" });
  };

  // Langkah 5.2: validasi semua isian sebelum dikirim
  const validasi = () => {
    const e = {};
    if (!/^\d{10,15}$/.test(teleponBersih))
      e.telepon = "No. HP harus 10-15 digit angka";
    if (customer.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter";
    if (customer.alamat.trim().length < 10)
      e.alamat = "Alamat terlalu singkat, tulis lengkap beserta patokan";

    const eu = {};
    units.forEach((u) => {
      const ue = {};
      if (!u.lokasi.trim()) ue.lokasi = "Lokasi ruangan wajib diisi";
      if (u.merek === "Lainnya" && !u.merekLain.trim())
        ue.merekLain = "Tulis merek AC";
      if (!u.layananId) ue.layananId = "Pilih jenis layanan";
      if (Object.keys(ue).length > 0) eu[u.uid] = ue;
    });
    if (Object.keys(eu).length > 0) e.units = eu;

    if (!jadwal.tanggal) e.tanggal = "Pilih tanggal kedatangan";
    if (!jadwal.jam) e.jam = "Pilih jam kedatangan";
    if (!setuju) e.setuju = "Centang pernyataan untuk melanjutkan";

    return e;
  };

  const kirim = async () => {
    const e = validasi();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // robot mengisi kolom jebakan: berpura-pura berhasil tanpa menghubungi server
    if (jebakan) {
      setHasil({
        kode: "-",
        jadwal: formatJadwal(jadwal.tanggal, jadwal.jam),
        pura: true,
      });
      return;
    }

    setSubmitting(true);
    setGagalKirim("");

    const payload = {
      pelanggan: customer.nama.trim(),
      telepon: teleponBersih,
      alamatId: "", // pelanggan selalu mengirim alamat baru, tidak memakai alamat tersimpan
      alamat: customer.alamat.trim(),
      labelAlamat: customer.labelAlamat.trim(),
      catatanLokasi: customer.catatanLokasi.trim(),
      tanggal: jadwal.tanggal,
      jam: jadwal.jam,
      items: ringkasan.map((u) => ({
        unit: u.lokasi.trim(),
        merek: namaMerek(u),
        kapasitas: u.kapasitas,
        tipe: u.tipe,
        layananId: u.layanan.id,
        catatan: u.catatan.trim(),
      })),
    };

    try {
      const dibuat = await createPublicBooking(payload);
      setHasil({
        kode: dibuat.kode,
        jadwal: formatJadwal(jadwal.tanggal, jadwal.jam),
        telepon: teleponBersih,
      });
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setGagalKirim(pesanError(err));
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setCustomer(customerKosong);
    setUnits([unitBaru()]);
    setJadwal(jadwalKosong);
    setSetuju(false);
    setErrors({});
    setGagalKirim("");
    setHasil(null);
  };

  const total = hitungTotal(ringkasan);
  const adaLayanan = ringkasan.some((u) => u.layanan);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Langkah 5.3: kepala halaman publik, tanpa sidebar admin */}
      <header ref={topRef} className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Snowflake size={22} />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-tight text-primary">
                Sejuk<span className="text-secondary">Pro</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                AC Service &amp; Booking
              </p>
            </div>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Langkah 5.4: halaman sukses, nomor registrasi dipakai untuk cek status */}
        {hasil ? (
          <div className="mx-auto max-w-lg rounded-xl border border-soft bg-white p-8 text-center shadow-sm">
            <CheckCircle2 size={56} className="mx-auto text-green-600" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Booking Berhasil Dikirim
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Booking Anda berstatus <strong>Menunggu</strong> sampai
              dikonfirmasi admin.
            </p>

            <div className="mt-5 rounded-xl bg-soft/40 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Nomor Registrasi
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary">
                {hasil.kode}
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Jadwal: {hasil.jadwal} WIB
              </p>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Simpan nomor registrasi ini. Anda memerlukannya bersama nomor HP
              untuk cek status servis di beranda.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary"
              >
                Kembali ke Beranda
              </Link>
              <button
                onClick={reset}
                className="rounded-lg border border-soft bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-soft"
              >
                Buat Booking Lagi
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Pesan Service AC
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Isi data Anda, pilih layanan untuk setiap unit AC, lalu tentukan
                jadwal kedatangan teknisi.
              </p>
            </div>

            {gagalLayanan && (
              <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                {gagalLayanan}
              </p>
            )}
            {gagalKirim && (
              <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                {gagalKirim}
              </p>
            )}

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <StepCustomer
                  data={customer}
                  errors={errors}
                  onChange={handleCustomer}
                  onNext={() => {}}
                  hideNavigation={true}
                />

                <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">
                      2
                    </span>
                    <div>
                      <h2 className="text-lg font-bold uppercase text-slate-900">
                        Layanan & Detail Unit AC
                      </h2>
                      <p className="text-sm text-slate-600">
                        Punya lebih dari satu AC? Tambahkan semuanya, tiap unit
                        bisa memilih layanan berbeda.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <StepUnits
                      units={units}
                      ringkasan={ringkasan}
                      layananList={layananList}
                      errors={errors.units || {}}
                      onChangeUnit={handleUnit}
                      onRemove={removeUnit}
                      canRemove={units.length > 1}
                      hideNavigation={true}
                    />
                    <button
                      type="button"
                      onClick={addUnit}
                      disabled={units.length >= MAKS_UNIT}
                      className="w-full rounded-lg border-2 border-dashed border-secondary/50 py-3 text-sm font-bold text-secondary hover:bg-soft/40 disabled:opacity-50"
                    >
                      + Tambah Unit AC Lainnya (Maks. {MAKS_UNIT} Unit)
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">
                      3
                    </span>
                    <div>
                      <h2 className="text-lg font-bold uppercase text-slate-900">
                        Pilih Jadwal Service
                      </h2>
                      <p className="text-sm text-slate-600">
                        Pilih tanggal dan jam kedatangan teknisi.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <StepSchedule
                      jadwal={jadwal}
                      errors={errors}
                      jumlahUnit={units.length}
                      durasi={hitungDurasi(ringkasan)}
                      onTanggal={handleTanggal}
                      onJam={handleJam}
                      hideNavigation={true}
                    />
                  </div>
                </div>

                {/* kolom jebakan, disembunyikan dari pengguna dan pembaca layar */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Jangan diisi</label>
                  <input
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={jebakan}
                    onChange={(e) => setJebakan(e.target.value)}
                  />
                </div>

                <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={setuju}
                      onChange={(e) => {
                        setSetuju(e.target.checked);
                        setErrors({ ...errors, setuju: "" });
                      }}
                      className="mt-1"
                    />
                    <span className="text-slate-700">
                      Saya menyatakan data di atas benar dan bersedia dihubungi
                      oleh admin SejukPro untuk konfirmasi jadwal.
                    </span>
                  </label>
                  {errors.setuju && (
                    <p className="mt-2 text-xs text-red-600">{errors.setuju}</p>
                  )}

                  <button
                    type="button"
                    onClick={kirim}
                    disabled={submitting}
                    className="mt-5 w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
                  >
                    {submitting ? "Mengirim..." : "Kirim Booking"}
                  </button>
                </div>
              </div>

              {/* Langkah 5.5: ringkasan perkiraan biaya, tanpa istilah pembayaran admin */}
              <aside className="rounded-xl border border-soft bg-white p-5 shadow-md lg:sticky lg:top-6 lg:col-span-4">
                <h2 className="border-b border-soft pb-3 text-sm font-bold text-slate-900">
                  Perkiraan Biaya{" "}
                  <span className="font-normal text-slate-500">
                    ({units.length} unit AC)
                  </span>
                </h2>

                <ul className="space-y-2 py-4 text-xs">
                  {ringkasan.map((u, i) => (
                    <li
                      key={u.uid}
                      className="flex justify-between gap-2 rounded-lg bg-soft/30 px-3 py-2"
                    >
                      <span>
                        Unit #{i + 1}{" "}
                        {u.layanan ? (
                          u.layanan.nama
                        ) : (
                          <em className="text-slate-400">
                            belum memilih layanan
                          </em>
                        )}
                      </span>
                      {u.layanan && (
                        <span className="shrink-0 font-bold">
                          {formatRupiah(u.layanan.harga)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-soft pt-3">
                  <p className="text-[11px] font-bold uppercase text-slate-400">
                    Total Perkiraan
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {adaLayanan ? formatRupiah(total) : "-"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Biaya akhir dikonfirmasi admin. Pembayaran dilakukan setelah
                    servis selesai.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}