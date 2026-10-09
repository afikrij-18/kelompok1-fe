// src/pages/Booking.jsx
// Halaman form booking di /booking/baru (di dalam layout admin)
// 3 Langkah: 1. Booking (Form terpadu), 2. Review & Pembayaran, 3. Selesai
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import StepIndicator from "../components/booking/StepIndicator";
import FormBooking from "../components/booking/FormBooking";
import StepReview from "../components/booking/StepReview";
import StepSuccess from "../components/booking/StepSuccess";
import BookingSummary from "../components/booking/BookingSummary";

import { layanan as layananFallback } from "../data/layananDummy";
import { users as usersFallback } from "../data/userDummy";
import { bookings } from "../data/dummy";
import { MAKS_UNIT } from "../data/bookingOptions";
import { formatJadwal, slotTerlewat, namaMerek } from "../utils/booking";

import { getServices } from "../services/serviceService";
import { getUsers } from "../services/userService";
import { getCustomers, createBooking } from "../services/bookingService";

const customerKosong = { nama: "", telepon: "", alamat: "" };
const jadwalKosong = { tanggal: "", jam: "" };

export default function Booking() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  // Data dinamis dari API / fallback dummy
  const [layananList, setLayananList] = useState(layananFallback.filter((l) => l.status === "Aktif"));
  const [teknisiList, setTeknisiList] = useState(
    usersFallback.filter((u) => u.role === "Teknisi" && u.status === "Aktif")
  );
  const [pelangganTerdaftar, setPelangganTerdaftar] = useState([]);

  // State Formulir Booking
  const [customer, setCustomer] = useState(customerKosong);
  const [jadwal, setJadwal] = useState(jadwalKosong);
  const [teknisi, setTeknisi] = useState("");

  // State Review & Pembayaran
  const [metodePembayaran, setMetodePembayaran] = useState("tunai");
  const [bank, setBank] = useState("");
  const [setuju, setSetuju] = useState(false);

  // Status submission & error
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasil, setHasil] = useState(null);

  // Ref & Unit AC
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

  // Scroll to top saat langkah berganti
  const topRef = useRef(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Muat data pendukung (layanan, teknisi, daftar riwayat pelanggan)
  useEffect(() => {
    getServices()
      .then((data) => {
        if (data && data.length > 0) setLayananList(data);
      })
      .catch(() => {});

    getUsers()
      .then((users) => {
        const hanyaTeknisi = users.filter((u) => u.role === "Teknisi" && u.status === "Aktif");
        if (hanyaTeknisi.length > 0) setTeknisiList(hanyaTeknisi);
      })
      .catch(() => {});

    getCustomers()
      .then(setPelangganTerdaftar)
      .catch(() => {});
  }, []);

  // Gabungkan unit dengan objek detail layanannya
  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));

  // Peringatan jika nomor hp/nama pelanggan sudah pernah booking
  const peringatanPelanggan = [];
  if (customer.telepon) {
    const cocok = pelangganTerdaftar.find((p) => p.telepon === customer.telepon.trim());
    if (cocok) {
      peringatanPelanggan.push(
        `Nomor telepon ini sebelumnya pernah digunakan atas nama "${cocok.nama}".`
      );
    }
  }

  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 2)));
  };

  // ---------- Input Handlers ----------
  const handleCustomer = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUnit = (uid, field, value) => {
    setUnits((prev) => prev.map((u) => (u.uid === uid ? { ...u, [field]: value } : u)));
    setErrors((prev) => ({
      ...prev,
      units: { ...prev.units, [uid]: { ...prev.units?.[uid], [field]: "" } },
    }));
  };

  const addUnit = () => {
    if (units.length < MAKS_UNIT) setUnits((prev) => [...prev, unitBaru()]);
  };

  const removeUnit = (uid) => {
    setUnits((prev) => prev.filter((u) => u.uid !== uid));
  };

  const handleTanggal = (iso) => {
    setJadwal((j) => ({ tanggal: iso, jam: slotTerlewat(iso, j.jam) ? "" : j.jam }));
    setErrors((prev) => ({ ...prev, tanggal: "" }));
  };

  const handleJam = (jam) => {
    setJadwal((prev) => ({ ...prev, jam }));
    setErrors((prev) => ({ ...prev, jam: "" }));
  };

  // ---------- Validasi ----------
  const teleponBersih = customer.telepon.replace(/[\s-]/g, "");

  const validasiBooking = () => {
    const e = {};

    // 1. Pelanggan
    if (customer.nama.trim().length < 2) e.nama = "Nama pelanggan minimal 2 karakter";
    if (!/^\d{10,15}$/.test(teleponBersih)) e.telepon = "Nomor HP harus 10-15 digit angka";
    if (customer.alamat.trim().length < 10) e.alamat = "Alamat terlalu singkat, tuliskan alamat lengkap & patokan";

    // 2. Unit AC
    const eu = {};
    units.forEach((u) => {
      const ue = {};
      if (!u.lokasi.trim()) ue.lokasi = "Lokasi ruangan wajib diisi";
      if (u.merek === "Lainnya" && !u.merekLain.trim()) ue.merekLain = "Tulis nama merek AC";
      if (!u.layananId) ue.layananId = "Pilih jenis layanan untuk unit ini";
      if (Object.keys(ue).length > 0) eu[u.uid] = ue;
    });
    if (Object.keys(eu).length > 0) e.units = eu;

    // 3. Jadwal
    if (!jadwal.tanggal) e.tanggal = "Pilih tanggal kedatangan";
    if (!jadwal.jam) e.jam = "Pilih jam kedatangan";

    return e;
  };

  const validasiReview = () => {
    const e = {};
    if (!metodePembayaran) e.metodePembayaran = "Pilih metode pembayaran";
    if (metodePembayaran === "transfer" && !bank) e.bank = "Pilih bank tujuan transfer";
    if (!setuju) e.setuju = "Centang persetujuan pelanggan untuk menyelesaikan pesanan";
    return e;
  };

  // Navigasi langkah
  const lanjutKeReview = () => {
    const e = validasiBooking();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    pindah(2);
  };

  const kembaliKeBooking = () => {
    setErrors({});
    pindah(1);
  };

  // Kirim / Selesaikan Pesanan
  const kirimBooking = async () => {
    const e = validasiReview();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);

    const kode = `REG-${String(bookings.length + 1).padStart(3, "0")}`;
    const payload = {
      id: kode,
      pelanggan: customer.nama.trim(),
      telepon: teleponBersih,
      alamat: customer.alamat.trim(),
      jadwal: formatJadwal(jadwal.tanggal, jadwal.jam),
      teknisi: teknisi || "Belum Ditugaskan",
      status: "Menunggu",
      metodePembayaran,
      bank: metodePembayaran === "transfer" ? bank : null,
      items: ringkasan.map((u) => ({
        unit: u.lokasi.trim(),
        merek: namaMerek(u),
        kapasitas: u.kapasitas,
        tipe: u.tipe,
        layananId: u.layanan?.id,
        layanan: u.layanan?.nama || "Servis AC",
        harga: u.layanan?.harga || 0,
        catatan: u.catatan.trim(),
      })),
    };

    try {
      // Coba panggil createBooking API jika endpoint backend tersedia
      let hasilBooking = null;
      try {
        hasilBooking = await createBooking(payload);
      } catch {
        // Fallback simpan lokal jika backend booking belum terhubung
        hasilBooking = payload;
      }
      setHasil({ ...payload, ...hasilBooking });
      setStep(3);
    } catch (err) {
      setErrors({ server: err.message || "Gagal memproses booking" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomer(customerKosong);
    setUnits([unitBaru()]);
    setJadwal(jadwalKosong);
    setTeknisi("");
    setMetodePembayaran("tunai");
    setBank("");
    setSetuju(false);
    setErrors({});
    setHasil(null);
    setMaxStep(1);
    setStep(1);
  };

  return (
    <>
      <header ref={topRef} className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Booking Baru</h1>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Formulir Booking Servis AC</h2>
            <p className="mt-1 text-sm text-slate-600">
              Input pesanan servis AC pelanggan: data diri, unit AC, jadwal, teknisi, dan review pembayaran.
            </p>
          </div>

          <StepIndicator step={step} maxStep={maxStep} onJump={(s) => pindah(s)} />

          <div className="mt-6">
            {step === 1 && (
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Kolom Kiri: Form Lengkap (Customer, Units, Jadwal, Teknisi) */}
                <div className="lg:col-span-8">
                  <FormBooking
                    customer={customer}
                    units={units}
                    ringkasan={ringkasan}
                    jadwal={jadwal}
                    teknisi={teknisi}
                    teknisiList={teknisiList}
                    layananList={layananList}
                    errors={errors}
                    peringatan={peringatanPelanggan}
                    onCustomerChange={handleCustomer}
                    onUnitChange={handleUnit}
                    onAddUnit={addUnit}
                    onRemoveUnit={removeUnit}
                    onTanggalChange={handleTanggal}
                    onJamChange={handleJam}
                    onTeknisiChange={setTeknisi}
                  />
                </div>

                {/* Kolom Kanan: Card Estimasi Biaya (Sticky) */}
                <div className="lg:sticky lg:top-6 lg:col-span-4">
                  <BookingSummary
                    items={ringkasan}
                    action={
                      <button
                        type="button"
                        onClick={lanjutKeReview}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-secondary transition"
                      >
                        <span>Lanjutkan ke Review</span>
                        <ArrowRight size={18} />
                      </button>
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Kolom Kiri: Tampilan Review & Pemilihan Pembayaran */}
                <div className="lg:col-span-8">
                  {errors.server && (
                    <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{errors.server}</p>
                  )}
                  <StepReview
                    customer={{ ...customer, telepon: teleponBersih }}
                    ringkasan={ringkasan}
                    jadwal={jadwal}
                    teknisiNama={teknisi || "Belum Ditugaskan"}
                    metodePembayaran={metodePembayaran}
                    bank={bank}
                    setuju={setuju}
                    errors={errors}
                    submitting={submitting}
                    onMetodeChange={(m) => {
                      setMetodePembayaran(m);
                      setErrors((prev) => ({ ...prev, metodePembayaran: "", bank: "" }));
                    }}
                    onBankChange={(b) => {
                      setBank(b);
                      setErrors((prev) => ({ ...prev, bank: "" }));
                    }}
                    onSetuju={(v) => {
                      setSetuju(v);
                      setErrors((prev) => ({ ...prev, setuju: "" }));
                    }}
                    onBack={kembaliKeBooking}
                    onUbahBooking={kembaliKeBooking}
                    onSubmit={kirimBooking}
                  />
                </div>

                {/* Kolom Kanan: Card Estimasi Biaya (Sticky) */}
                <div className="lg:sticky lg:top-6 lg:col-span-4">
                  <BookingSummary
                    items={ringkasan}
                    action={
                      <button
                        type="button"
                        onClick={kirimBooking}
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 transition"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <span>Konfirmasi & Selesai</span>
                        )}
                      </button>
                    }
                  />
                </div>
              </div>
            )}

            {step === 3 && hasil && <StepSuccess hasil={hasil} onReset={resetForm} />}
          </div>
        </div>
      </main>
    </>
  );
}
