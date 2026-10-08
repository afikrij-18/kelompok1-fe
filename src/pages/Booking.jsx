// src/pages/Booking.jsx  (FE, DIGANTI seluruh isi)
// halaman form booking di /booking/baru (di dalam layout admin)
// Versi ini TIDAK memakai bookingService, jadi tidak ada import createBooking
import { useEffect, useRef, useState } from "react";
import StepIndicator from "../components/booking/StepIndicator";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import StepReview from "../components/booking/StepReview";
import StepSuccess from "../components/booking/StepSuccess";
import { layanan as semuaLayanan } from "../data/layananDummy";
import { bookings } from "../data/dummy";
import { MAKS_UNIT } from "../data/bookingOptions";
import { formatJadwal, slotTerlewat, hitungDurasi, namaMerek } from "../utils/booking";

// Langkah 7.1: hanya layanan berstatus Aktif yang bisa dipilih
const layananAktif = semuaLayanan.filter((l) => l.status === "Aktif");

const customerKosong = { nama: "", telepon: "", alamat: "" };
const jadwalKosong = { tanggal: "", jam: "" };

export default function Booking() {
  const [step, setStep] = useState(1);

  // Langkah 7.2: langkah tertinggi yang pernah dicapai (maks 4 = review)
  // sudahSampaiReview true berarti tombol Lanjutkan langsung kembali ke review
  const [maxStep, setMaxStep] = useState(1);
  const sudahSampaiReview = maxStep >= 4;

  const [customer, setCustomer] = useState(customerKosong);
  const [jadwal, setJadwal] = useState(jadwalKosong);
  const [setuju, setSetuju] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasil, setHasil] = useState(null);

  // Langkah 7.3: daftar unit, minimal satu. uid = key dan penanda error per unit
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

  // Langkah 7.4: yang di-scroll adalah area kanan layout, jadi pakai scrollIntoView
  const topRef = useRef(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Langkah 7.5: unit digabung dengan objek layanan yang dipilih
  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananAktif.find((l) => String(l.id) === String(u.layananId)),
  }));

  // Langkah 7.6: semua perpindahan langkah lewat sini agar maxStep ikut tercatat
  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 4)));
  };

  // ---------- handler input ----------
  const handleCustomer = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleUnit = (uid, field, value) => {
    setUnits(units.map((u) => (u.uid === uid ? { ...u, [field]: value } : u)));
    setErrors({
      ...errors,
      units: { ...errors.units, [uid]: { ...errors.units?.[uid], [field]: "" } },
    });
  };

  const addUnit = () => {
    if (units.length < MAKS_UNIT) setUnits([...units, unitBaru()]);
  };
  const removeUnit = (uid) => setUnits(units.filter((u) => u.uid !== uid));

  const handleTanggal = (iso) => {
    setJadwal((j) => ({ tanggal: iso, jam: slotTerlewat(iso, j.jam) ? "" : j.jam }));
    setErrors({ ...errors, tanggal: "" });
  };
  const handleJam = (jam) => {
    setJadwal({ ...jadwal, jam });
    setErrors({ ...errors, jam: "" });
  };

  // ---------- validasi per langkah ----------
  const teleponBersih = customer.telepon.replace(/[\s-]/g, "");

  const validasi = (n) => {
    const e = {};

    if (n === 1) {
      if (customer.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter";
      // aturan telepon sama dengan backend, 10-15 digit angka
      if (!/^\d{10,15}$/.test(teleponBersih)) e.telepon = "No. HP harus 10-15 digit angka";
      if (customer.alamat.trim().length < 10) e.alamat = "Alamat terlalu singkat, tulis lengkap beserta patokan";
    }

    if (n === 2) {
      const eu = {};
      units.forEach((u) => {
        const ue = {};
        if (!u.lokasi.trim()) ue.lokasi = "Lokasi ruangan wajib diisi";
        if (u.merek === "Lainnya" && !u.merekLain.trim()) ue.merekLain = "Tulis merek AC";
        if (!u.layananId) ue.layananId = "Pilih jenis layanan";
        if (Object.keys(ue).length > 0) eu[u.uid] = ue;
      });
      if (Object.keys(eu).length > 0) e.units = eu;
    }

    if (n === 3) {
      if (!jadwal.tanggal) e.tanggal = "Pilih tanggal kedatangan";
      if (!jadwal.jam) e.jam = "Pilih jam kedatangan";
    }

    if (n === 4 && !setuju) e.setuju = "Centang persetujuan pelanggan untuk melanjutkan";

    return e;
  };

  // ---------- navigasi ----------
  // Langkah 7.7: validasi langkah ini, lalu
  // - belum pernah sampai review: lanjut ke langkah berikutnya
  // - sudah pernah sampai review: kembali ke review, setelah semua langkah dicek ulang
  const lanjut = () => {
    const e = validasi(step);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (sudahSampaiReview) {
      for (let n = 1; n <= 3; n++) {
        const eN = validasi(n);
        if (Object.keys(eN).length > 0) {
          // ada langkah lain yang tidak lengkap (mis. jam hilang karena tanggal diganti)
          setErrors(eN);
          pindah(n);
          return;
        }
      }
      pindah(4);
      return;
    }

    pindah(step + 1);
  };

  const kembali = () => {
    setErrors({});
    pindah(step - 1);
  };

  // dipakai tombol "Ubah" di review dan klik pada stepper
  const lompat = (n) => {
    setErrors({});
    pindah(n);
  };

  // Langkah 7.8: simpan booking
  const kirim = () => {
    const e = validasi(4);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);

    // kode dari jumlah booking dummy, nanti dibuat oleh backend
    const kode = `REG-${String(bookings.length + 1).padStart(3, "0")}`;

    // bentuk sama dengan bookings di dummy.js, ditambah kontak dan spesifikasi unit
    // nama layanan dan harga disalin agar booking lama tidak berubah saat katalog diubah
    const payload = {
      id: kode,
      pelanggan: customer.nama.trim(),
      telepon: teleponBersih,
      alamat: customer.alamat.trim(),
      jadwal: formatJadwal(jadwal.tanggal, jadwal.jam),
      teknisi: "-", // ditugaskan lewat Jadwal & Dispatch
      status: "Menunggu",
      items: ringkasan.map((u) => ({
        unit: u.lokasi.trim(),
        merek: namaMerek(u),
        kapasitas: u.kapasitas,
        tipe: u.tipe,
        layananId: u.layanan.id,
        layanan: u.layanan.nama,
        harga: u.layanan.harga,
        catatan: u.catatan.trim(),
      })),
    };

    console.log("Booking baru:", payload);

    // Langkah 7.9: simulasi menunggu respons server, diganti pemanggilan API nanti
    setTimeout(() => {
      setHasil(payload);
      setSubmitting(false);
      setStep(5);
    }, 600);
  };

  const reset = () => {
    setCustomer(customerKosong);
    setUnits([unitBaru()]);
    setJadwal(jadwalKosong);
    setSetuju(false);
    setErrors({});
    setHasil(null);
    setMaxStep(1); // booking baru mulai lagi dari alur biasa
    setStep(1);
  };

  // Langkah 7.10: teks tombol Lanjutkan, kosong = memakai teks bawaan tiap langkah
  const labelNext = sudahSampaiReview ? "Simpan & Kembali ke Review" : undefined;

  return (
    <>
      <header ref={topRef} className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Booking Baru</h1>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Formulir Booking Service AC</h2>
            <p className="mt-1 text-sm text-slate-600">
              Input booking atas nama pelanggan. Bisa tambah beberapa unit AC di lokasi yang sama dalam 1 pemesanan.
            </p>
          </div>

          <StepIndicator step={step} maxStep={maxStep} onJump={lompat} />

          <div className="mt-6">
            {step === 1 && (
              <StepCustomer data={customer} errors={errors} onChange={handleCustomer} onNext={lanjut} labelNext={labelNext} />
            )}

            {step === 2 && (
              <StepUnits
                units={units}
                ringkasan={ringkasan}
                layananList={layananAktif}
                errors={errors.units}
                onChangeUnit={handleUnit}
                onAdd={addUnit}
                onRemove={removeUnit}
                onBack={kembali}
                onNext={lanjut}
                labelNext={labelNext}
              />
            )}

            {step === 3 && (
              <StepSchedule
                jadwal={jadwal}
                errors={errors}
                jumlahUnit={units.length}
                durasi={hitungDurasi(ringkasan)}
                onTanggal={handleTanggal}
                onJam={handleJam}
                onBack={kembali}
                onNext={lanjut}
                labelNext={labelNext}
              />
            )}

            {step === 4 && (
              <StepReview
                customer={{ ...customer, telepon: teleponBersih }}
                ringkasan={ringkasan}
                jadwal={jadwal}
                setuju={setuju}
                errors={errors}
                submitting={submitting}
                onSetuju={(v) => {
                  setSetuju(v);
                  setErrors({});
                }}
                onGo={lompat}
                onBack={kembali}
                onSubmit={kirim}
              />
            )}

            {step === 5 && hasil && <StepSuccess hasil={hasil} onReset={reset} />}
          </div>
        </div>
      </main>
    </>
  );
}