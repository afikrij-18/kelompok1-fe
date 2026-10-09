// src/pages/Booking.jsx
// Langkah 4: form booking admin, dengan pilihan pembayaran lunas di langkah review
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import StepIndicator from "../components/booking/StepIndicator";
import FormBooking from "../components/booking/FormBooking";
import StepReview from "../components/booking/StepReview";
import StepSuccess from "../components/booking/StepSuccess";
import PembayaranSection from "../components/booking/PembayaranSection";
import { getServices } from "../services/serviceService";
import { createBooking, getCustomers, updateBookingStatus } from "../services/bookingService";
import { createTransaction } from "../services/transactionService";
import { METODE } from "../services/transactionMapper";
import { MAKS_UNIT } from "../data/bookingOptions";
import {
  formatJadwal,
  formatRupiah,
  slotTerlewat,
  hitungDurasi,
  hitungTotal,
  namaMerek,
} from "../utils/booking";
import { cekPelanggan, cariPelanggan } from "../utils/pelanggan";

// addressId "" = alamat baru, selain itu id alamat tersimpan milik pelanggan
const customerKosong = {
  nama: "",
  telepon: "",
  addressId: "",
  alamat: "",
  labelAlamat: "",
  catatanLokasi: "",
};
const jadwalKosong = { tanggal: "", jam: "" };
// Langkah 4.1: pembayaran awal, belum dibayar
const bayarKosong = { status: "belum", metode: "cash", catatan: "" };

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function Booking() {
  const [step, setStep] = useState(1);

  // langkah tertinggi yang pernah dicapai (maks 4 = review)
  // sudahSampaiReview true berarti tombol Lanjutkan langsung kembali ke review
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
  const [bayar, setBayar] = useState(bayarKosong);
  const [setuju, setSetuju] = useState(false);

  // Status submission & error
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasil, setHasil] = useState(null);

  // data dari API
  const [layananList, setLayananList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [gagalLayanan, setGagalLayanan] = useState("");
  const [gagalKirim, setGagalKirim] = useState("");
  // Langkah 4.2: hasil pencatatan pembayaran { tipe: "sukses" | "peringatan", teks }
  const [infoBayar, setInfoBayar] = useState(null);

  // nama yang terakhir diisi otomatis dari nomor HP,
  // dipakai agar nama yang diketik sendiri tidak tertimpa
  const namaOtomatis = useRef("");

  // ---------- muat data dari API ----------
  useEffect(() => {
    getServices()
      .then(setLayananList)
      .catch((err) => setGagalLayanan(pesanError(err)));
  }, []);

  useEffect(() => {
    // gagal dimuat diabaikan, data pelanggan hanya tambahan
    getCustomers().then(setPelangganList).catch(() => {});
  }, []);

  // ---------- unit AC ----------
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

  // yang di-scroll adalah area kanan layout, jadi pakai scrollIntoView
  const topRef = useRef(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));

  // nomor HP tanpa spasi dan strip, harus dibuat sebelum dikenal, peringatan, dan validasi
  const teleponBersih = customer.telepon.replace(/[\s-]/g, "");

  // pelanggan terdaftar, peringatannya, dan teks alamat yang dipakai booking
  const dikenal = cariPelanggan(teleponBersih, pelangganList);
  const peringatan = cekPelanggan(customer, teleponBersih, pelangganList);
  const alamatTerpilih = customer.addressId
    ? dikenal?.alamatList.find((a) => String(a.id) === String(customer.addressId))?.alamat || ""
    : customer.alamat.trim();

  // semua perpindahan langkah lewat sini agar maxStep ikut tercatat
  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 2)));
  };

  // ---------- handler input ----------
  // nomor HP lengkap yang terdaftar mengisi nama otomatis dan memilih alamat terbaru.
  // Nama yang sudah diketik sendiri tidak ditimpa
  const handleCustomer = (e) => {
    const { name, value } = e.target;
    const baru = { ...customer, [name]: value };
    const galat = { ...errors, [name]: "" };

    if (name === "telepon") {
      const cocok = cariPelanggan(value.replace(/[\s-]/g, ""), pelangganList);
      const bolehIsi = !customer.nama.trim() || customer.nama === namaOtomatis.current;

      if (cocok && bolehIsi) {
        baru.nama = cocok.nama;
        namaOtomatis.current = cocok.nama;
        galat.nama = "";
      } else if (!cocok && namaOtomatis.current && customer.nama === namaOtomatis.current) {
        // nomor diubah ke nomor yang tidak terdaftar, nama otomatis tadi dihapus
        baru.nama = "";
        namaOtomatis.current = "";
      }

      // alamat: pakai yang sudah dipilih jika milik pelanggan ini, kalau tidak pilih yang terbaru
      if (cocok && cocok.alamatList.length > 0) {
        const masihAda = cocok.alamatList.some((a) => String(a.id) === String(customer.addressId));
        baru.addressId = masihAda ? customer.addressId : cocok.alamatList[0].id;
      } else {
        baru.addressId = "";
      }
      galat.alamat = "";
    }

    setCustomer(baru);
    setErrors(galat);
  };

  // pilih alamat tersimpan (id) atau alamat baru ("")
  const pilihAlamat = (id) => {
    setCustomer((c) => ({ ...c, addressId: id }));
    setErrors((e) => ({ ...e, alamat: "" }));
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

  // ---------- validasi per langkah ----------
  const validasi = (n) => {
    const e = {};

    if (n === 1) {
      if (!/^\d{10,15}$/.test(teleponBersih)) e.telepon = "No. HP harus 10-15 digit angka";
      if (customer.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter";
      // alamat tersimpan sudah pasti valid, alamat baru harus diisi lengkap
      if (!customer.addressId && customer.alamat.trim().length < 10) {
        e.alamat = "Alamat terlalu singkat, tulis lengkap beserta patokan";
      }
    }

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

  // ---------- navigasi ----------
  // validasi langkah ini, lalu
  // - belum pernah sampai review: lanjut ke langkah berikutnya
  // - sudah pernah sampai review: kembali ke review, setelah semua langkah dicek ulang
  const lanjut = () => {
    const e = validasi(step);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    pindah(2);
  };

  const kembaliKeBooking = () => {
    setErrors({});
    pindah(1);
  };

  // dipakai tombol "Ubah" di review dan klik pada stepper
  const lompat = (n) => {
    setErrors({});
    pindah(n);
  };

  // ---------- kirim ke API ----------
  const kirim = async () => {
    const e = validasi(4);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setGagalKirim("");
    setInfoBayar(null);

    // alamatId terisi = pakai alamat tersimpan, kosong = kirim alamat baru
    const payload = {
      pelanggan: customer.nama.trim(),
      telepon: teleponBersih,
      alamatId: customer.addressId,
      alamat: alamatTerpilih,
      labelAlamat: customer.labelAlamat.trim(),
      catatanLokasi: customer.catatanLokasi.trim(),
      jadwal: formatJadwal(jadwal.tanggal, jadwal.jam), // teks untuk halaman sukses
      tanggal: jadwal.tanggal,
      jam: jadwal.jam,
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
      const dibuat = await createBooking(payload);

      // Langkah 4.3: booking sudah tersimpan, lalu catat pembayaran jika dipilih lunas
      let info = null;
      if (bayar.status === "lunas") {
        try {
          await createTransaction({
            bookingId: dibuat.id,
            metode: bayar.metode,
            jumlah: dibuat.total,
            catatan: bayar.catatan.trim(),
          });
          info = {
            tipe: "sukses",
            teks: `Pembayaran lunas ${formatRupiah(dibuat.total)} (${METODE[bayar.metode]}) tercatat.`,
          };

          // Langkah 4.4: backend mengubah status booking menjadi Selesai saat pembayaran lunas dicatat,
          // jadi statusnya dikembalikan ke Menunggu karena servis belum dikerjakan
          try {
            await updateBookingStatus(dibuat, "Menunggu");
          } catch {
            info = {
              tipe: "peringatan",
              teks: "Pembayaran tercatat, tetapi status booking berubah otomatis menjadi Selesai. Ubah kembali di menu Booking.",
            };
          }
        } catch (err) {
          // booking tetap aman, hanya pembayarannya yang belum tercatat
          info = {
            tipe: "peringatan",
            teks: `Booking tersimpan, tetapi pembayaran gagal dicatat: ${pesanError(err)} Catat pembayarannya secara terpisah.`,
          };
        }
      }

      setInfoBayar(info);
      // nomor registrasi dari backend, sisanya dari form
      setHasil({ ...payload, id: dibuat.kode });
      setStep(5);
    } catch (err) {
      setGagalKirim(pesanError(err));
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setCustomer(customerKosong);
    setUnits([unitBaru()]);
    setJadwal(jadwalKosong);
    setBayar(bayarKosong);
    setSetuju(false);
    setErrors({});
    setHasil(null);
    setGagalKirim("");
    setInfoBayar(null);
    setMaxStep(1); // booking baru mulai lagi dari alur biasa
    setStep(1);
    namaOtomatis.current = "";
    // muat ulang pelanggan supaya pelanggan dan alamat yang baru dibuat ikut terhitung
    getCustomers().then(setPelangganList).catch(() => {});
  };

  // teks tombol Lanjutkan, kosong = memakai teks bawaan tiap langkah
  const labelNext = sudahSampaiReview ? "Simpan & Kembali ke Review" : undefined;

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

          {gagalLayanan && (
            <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{gagalLayanan}</p>
          )}

          {gagalKirim && (
            <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{gagalKirim}</p>
          )}

          {/* Langkah 4.5: hasil pencatatan pembayaran, tampil juga di halaman sukses */}
          {infoBayar && (
            <p
              className={`mb-4 rounded-lg px-4 py-2 text-sm ${
                infoBayar.tipe === "sukses" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
              }`}
            >
              {infoBayar.teks}
            </p>
          )}

          <StepIndicator step={step} maxStep={maxStep} onJump={lompat} />

          <div className="mt-6">
            {step === 1 && (
              <StepCustomer
                data={customer}
                errors={errors}
                onChange={handleCustomer}
                onNext={lanjut}
                labelNext={labelNext}
                peringatan={peringatan}
                dikenal={dikenal}
                onPilihAlamat={pilihAlamat}
              />
            )}

            {step === 2 && (
              <StepUnits
                units={units}
                ringkasan={ringkasan}
                layananList={layananList}
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

            {/* Langkah 4.6: pembayaran tampil tepat di atas review */}
            {step === 4 && (
              <div className="space-y-5">
                <PembayaranSection bayar={bayar} onChange={setBayar} total={hitungTotal(ringkasan)} />
                <StepReview
                  customer={{ ...customer, telepon: teleponBersih, alamat: alamatTerpilih }}
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
              </div>
            )}

            {step === 5 && hasil && <StepSuccess hasil={hasil} onReset={reset} />}
          </div>
        </div>
      </main>
    </>
  );
}
