// src/pages/Booking.jsx
import { useEffect, useRef, useState } from "react";
import StepIndicator from "../components/booking/StepIndicator";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import StepReview from "../components/booking/StepReview";
import StepSuccess from "../components/booking/StepSuccess";
import BookingSummary from "../components/booking/BookingSummary";
import { getServices } from "../services/serviceService";
import {
  createBooking,
  getCustomers,
  updateBookingStatus,
} from "../services/bookingService";
import { createTransaction } from "../services/transactionService";
import { getUsers } from "../services/userService";
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
import { Wrench } from "lucide-react";

const customerKosong = {
  nama: "",
  telepon: "",
  addressId: "",
  alamat: "",
  labelAlamat: "",
  catatanLokasi: "",
};
const jadwalKosong = { tanggal: "", jam: "" };
const bayarKosong = {
  status: "belum",
  metode: "cash",
  bank: "BCA",
  catatan: "",
};

const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function Booking() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  const [customer, setCustomer] = useState(customerKosong);
  const [jadwal, setJadwal] = useState(jadwalKosong);
  const [teknisiId, setTeknisiId] = useState("");
  const [bayar, setBayar] = useState(bayarKosong);
  const [setuju, setSetuju] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hasil, setHasil] = useState(null);

  const [layananList, setLayananList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);
  const [gagalLayanan, setGagalLayanan] = useState("");
  const [gagalKirim, setGagalKirim] = useState("");
  const [infoBayar, setInfoBayar] = useState(null);

  const namaOtomatis = useRef("");

  useEffect(() => {
    getServices()
      .then(setLayananList)
      .catch((err) => setGagalLayanan(pesanError(err)));
  }, []);

  useEffect(() => {
    getCustomers()
      .then(setPelangganList)
      .catch(() => {});
    getUsers()
      .then((users) =>
        setTeknisiList(
          users.filter((u) => u.role === "Teknisi" || u.role === "Admin"),
        ),
      )
      .catch(() => {});
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
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));

  const teleponBersih = customer.telepon.replace(/[\s-]/g, "");
  const dikenal = cariPelanggan(teleponBersih, pelangganList);
  const peringatan = cekPelanggan(customer, teleponBersih, pelangganList);
  const alamatTerpilih = customer.addressId
    ? dikenal?.alamatList.find(
        (a) => String(a.id) === String(customer.addressId),
      )?.alamat || ""
    : customer.alamat.trim();

  const teknisiTerpilih = teknisiList.find(
    (t) => String(t.id) === String(teknisiId),
  );

  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 3)));
  };

  const handleCustomer = (e) => {
    const { name, value } = e.target;
    const baru = { ...customer, [name]: value };
    const galat = { ...errors, [name]: "" };

    if (name === "telepon") {
      const cocok = cariPelanggan(value.replace(/[\s-]/g, ""), pelangganList);
      const bolehIsi =
        !customer.nama.trim() || customer.nama === namaOtomatis.current;

      if (cocok && bolehIsi) {
        baru.nama = cocok.nama;
        namaOtomatis.current = cocok.nama;
        galat.nama = "";
      } else if (
        !cocok &&
        namaOtomatis.current &&
        customer.nama === namaOtomatis.current
      ) {
        baru.nama = "";
        namaOtomatis.current = "";
      }

      if (cocok && cocok.alamatList.length > 0) {
        const masihAda = cocok.alamatList.some(
          (a) => String(a.id) === String(customer.addressId),
        );
        baru.addressId = masihAda ? customer.addressId : cocok.alamatList[0].id;
      } else {
        baru.addressId = "";
      }
      galat.alamat = "";
    }

    setCustomer(baru);
    setErrors(galat);
  };

  const pilihAlamat = (id) => {
    setCustomer((c) => ({ ...c, addressId: id }));
    setErrors((e) => ({ ...e, alamat: "" }));
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

  const validasiLangkah1 = () => {
    const e = {};
    if (!/^\d{10,15}$/.test(teleponBersih))
      e.telepon = "No. HP harus 10-15 digit angka";
    if (customer.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter";
    if (!customer.addressId && customer.alamat.trim().length < 10) {
      e.alamat = "Alamat terlalu singkat, tulis lengkap beserta patokan";
    }

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

    return e;
  };

  const lanjut = () => {
    const e = validasiLangkah1();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    pindah(2);
  };

  const kembali = () => {
    setErrors({});
    pindah(step - 1);
  };

  const lompat = (n) => {
    setErrors({});
    pindah(n);
  };

  const kirim = async () => {
    if (!setuju) {
      setErrors({ setuju: "Centang persetujuan pelanggan untuk melanjutkan" });
      return;
    }

    setSubmitting(true);
    setGagalKirim("");
    setInfoBayar(null);

    const payload = {
      pelanggan: customer.nama.trim(),
      telepon: teleponBersih,
      alamatId: customer.addressId,
      alamat: alamatTerpilih,
      labelAlamat: customer.labelAlamat.trim(),
      catatanLokasi: customer.catatanLokasi.trim(),
      jadwal: formatJadwal(jadwal.tanggal, jadwal.jam),
      tanggal: jadwal.tanggal,
      jam: jadwal.jam,
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

    try {
      const dibuat = await createBooking(payload);

      try {
        await updateBookingStatus(dibuat, "Dikonfirmasi");
      } catch {}

      let info = null;
      if (bayar.status === "lunas") {
        try {
          const catatanBayar =
            bayar.metode === "transfer_bank"
              ? `Transfer ${bayar.bank} - ${bayar.catatan}`
              : bayar.catatan.trim();

          await createTransaction({
            bookingId: dibuat.id,
            metode: bayar.metode,
            jumlah: dibuat.total,
            catatan: catatanBayar,
          });
          info = {
            tipe: "sukses",
            teks: `Pembayaran lunas ${formatRupiah(dibuat.total)} (${METODE[bayar.metode]}${bayar.metode === "transfer_bank" ? ` via ${bayar.bank}` : ""}) tercatat.`,
          };
        } catch (err) {
          info = {
            tipe: "peringatan",
            teks: `Booking tersimpan, tetapi pembayaran gagal dicatat: ${pesanError(err)}`,
          };
        }
      }

      setInfoBayar(info);
      setHasil({
        ...payload,
        id: dibuat.kode,
        teknisi: teknisiTerpilih?.nama || "-",
      });
      setStep(3);
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
    setTeknisiId("");
    setBayar(bayarKosong);
    setSetuju(false);
    setErrors({});
    setHasil(null);
    setGagalKirim("");
    setInfoBayar(null);
    setMaxStep(1);
    setStep(1);
    namaOtomatis.current = "";
    getCustomers()
      .then(setPelangganList)
      .catch(() => {});
  };

  return (
    <>
      <header
        ref={topRef}
        className="border-b border-gray-200 bg-white px-6 py-4"
      >
        <h1 className="text-lg font-semibold text-primary">Booking Baru</h1>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Formulir Booking Service AC
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Input booking atas nama pelanggan, unit AC, jadwal, teknisi, dan
                pembayaran. Status otomatis Dikonfirmasi.
              </p>
            </div>
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

          {infoBayar && (
            <p
              className={`mb-4 rounded-lg px-4 py-2 text-sm ${
                infoBayar.tipe === "sukses"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {infoBayar.teks}
            </p>
          )}

          <StepIndicator step={step} maxStep={maxStep} onJump={lompat} />

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Bagian Kiri: Form Langkah */}
            <div className="lg:col-span-8 space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  {/* Bagian 1.1: Customer */}
                  <StepCustomer
                    data={customer}
                    errors={errors}
                    onChange={handleCustomer}
                    onNext={() => {}}
                    peringatan={peringatan}
                    dikenal={dikenal}
                    onPilihAlamat={pilihAlamat}
                    hideNavigation={true}
                  />

                  {/* Bagian 1.2: Unit AC & Layanan */}
                  <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">
                        2
                      </span>
                      <div>
                        <h2 className="text-lg font-bold uppercase text-slate-900">
                          Layanan & Detail Unit AC
                        </h2>
                        <p className="text-sm text-slate-600">
                          Tambahkan satu atau beberapa unit AC di lokasi yang
                          sama. Setiap unit bisa memilih layanan berbeda.
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

                  {/* Bagian 1.3: Jadwal & Teknisi */}
                  <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft font-bold text-primary">
                        3
                      </span>
                      <div>
                        <h2 className="text-lg font-bold uppercase text-slate-900">
                          Pilih Jadwal Service dan Teknisi
                        </h2>
                        <p className="text-sm text-slate-600">
                          Pilih tanggal dan jam kedatangan teknisi.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 mt-4">
                      <StepSchedule
                        jadwal={jadwal}
                        errors={errors}
                        jumlahUnit={units.length}
                        durasi={hitungDurasi(ringkasan)}
                        onTanggal={handleTanggal}
                        onJam={handleJam}
                        hideNavigation={true}
                      />

                      {/* Tambahan Teknisi Tersedia */}
                      <div className="pt-4 border-t border-soft">
                        <label
                          htmlFor="teknisi"
                          className="mb-1 block text-xs font-bold text-slate-800"
                        >
                          Pilih Teknisi Tersedia{" "}
                          <span className="font-normal text-slate-400">
                            (opsional)
                          </span>
                        </label>
                        <div className="relative">
                          <Wrench
                            size={18}
                            className="pointer-events-none absolute left-3 top-3 text-slate-400"
                          />
                          <select
                            id="teknisi"
                            value={teknisiId}
                            onChange={(e) => setTeknisiId(e.target.value)}
                            className="w-full rounded-lg border border-soft bg-white py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
                          >
                            <option value="">
                              -- Belum ditugaskan / Pilih nanti --
                            </option>
                            {teknisiList.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.nama} ({t.role})
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Teknisi dapat ditugaskan sekarang atau melalui menu
                          Jadwal & Dispatch.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Lanjut ke Review */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={lanjut}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-secondary"
                    >
                      Lanjutkan ke Review & Pembayaran →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <StepReview
                  customer={{
                    ...customer,
                    telepon: teleponBersih,
                    alamat: alamatTerpilih,
                  }}
                  ringkasan={ringkasan}
                  jadwal={jadwal}
                  teknisi={teknisiTerpilih}
                  teknisiList={teknisiList}
                  bayar={bayar}
                  onBayarChange={setBayar}
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

              {step === 3 && hasil && (
                <StepSuccess hasil={hasil} onReset={reset} />
              )}
            </div>

            {/* Bagian Kanan: Estimasi Pembayaran Samping (Sticky) */}
            <aside className="lg:sticky lg:top-6 lg:col-span-4">
              <BookingSummary items={ringkasan} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
