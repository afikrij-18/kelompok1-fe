// src/pages/BookingEdit.jsx
// Langkah 4: edit booking, satu halaman isian + review dengan pembayaran
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StepIndicator from "../components/booking/StepIndicator";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import StepReview from "../components/booking/StepReview";
import BookingSummary from "../components/booking/BookingSummary";
import { getServices } from "../services/serviceService";
import {
  getBookingById,
  updateBooking,
  updateBookingStatus,
} from "../services/bookingService";
import { getTechnicians } from "../services/technicianService";
import { createTransaction } from "../services/transactionService";
import { Wrench, Loader2 } from "lucide-react";
import { MAKS_UNIT } from "../data/bookingOptions";
import { hitungDurasi, namaMerek } from "../utils/booking";
import {
  BANK_OPSI,
  hitungPembayaran,
  susunCatatanBayar,
} from "../utils/pembayaran";

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState("");

  const [customer, setCustomer] = useState(null);
  const [alamatAsli, setAlamatAsli] = useState({
    alamat: "",
    label: "",
    catatan: "",
  });
  const [catatanBooking, setCatatanBooking] = useState("");
  const [statusAwal, setStatusAwal] = useState("");
  const [units, setUnits] = useState([]);
  const [jadwal, setJadwal] = useState({ tanggal: "", jam: "" });
  const [teknisiId, setTeknisiId] = useState("");
  const [bayar, setBayar] = useState({
    status: "belum",
    metode: "cash",
    bank: BANK_OPSI[0],
    catatan: "",
  });
  const [sudahDibayar, setSudahDibayar] = useState(0);
  const [setuju, setSetuju] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [gagalKirim, setGagalKirim] = useState("");

  const [layananList, setLayananList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);

  // Langkah 4.1: muat layanan, booking, dan teknisi bersamaan
  useEffect(() => {
    let batal = false;

    Promise.all([getServices(), getBookingById(id), getTechnicians()])
      .then(([services, booking, technicians]) => {
        if (batal) return;

        setLayananList(services);
        // teknisi aktif, ditambah teknisi yang sedang bertugas walau sudah nonaktif
        setTeknisiList(
          technicians.filter(
            (t) =>
              t.status === "Aktif" ||
              String(t.id) === String(booking.teknisiId),
          ),
        );

        setCustomer({
          nama: booking.pelanggan,
          telepon: booking.telepon,
          addressId: booking.alamatId,
          alamat: booking.alamat,
          labelAlamat: booking.labelAlamat,
          catatanLokasi: booking.catatanLokasi,
        });
        setAlamatAsli({
          alamat: booking.alamat,
          label: booking.labelAlamat,
          catatan: booking.catatanLokasi,
        });
        setCatatanBooking(booking.catatan);
        setStatusAwal(booking.status);

        setUnits(
          booking.items.map((it, idx) => ({
            uid: idx + 1,
            lokasi: it.unit,
            merek: it.merek,
            merekLain: "",
            kapasitas: it.kapasitas,
            tipe: it.tipe,
            layananId: it.layananId,
            catatan: it.catatan,
          })),
        );
        setJadwal({ tanggal: booking.tanggal, jam: booking.jam });
        setTeknisiId(booking.teknisiId || "");

        // Langkah 4.2: pembayaran yang sudah masuk, hanya yang berstatus paid
        const pay = hitungPembayaran(booking.total, booking.transaksi);
        setSudahDibayar(pay.dibayar);
        setBayar({
          status: "belum",
          metode: "cash",
          bank: BANK_OPSI[0],
          catatan: pay.dibayar > 0 ? "Pelunasan sisa tagihan" : "",
        });
      })
      .catch((err) => {
        if (!batal) setGagalMuat(pesanError(err));
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [id]);

  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));

  const teknisiTerpilih = teknisiList.find(
    (t) => String(t.id) === String(teknisiId),
  );

  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 2)));
  };

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
    if (units.length < MAKS_UNIT) {
      setUnits([
        ...units,
        {
          uid: Date.now(),
          merek: "Daikin",
          merekLain: "",
          kapasitas: "1 PK",
          tipe: "Split Wall",
          lokasi: "",
          layananId: "",
          catatan: "",
        },
      ]);
    }
  };

  const removeUnit = (uid) => setUnits(units.filter((u) => u.uid !== uid));

  const handleTanggal = (iso) => {
    setJadwal((j) => ({ ...j, tanggal: iso }));
    setErrors({ ...errors, tanggal: "" });
  };
  const handleJam = (jam) => {
    setJadwal((j) => ({ ...j, jam }));
    setErrors({ ...errors, jam: "" });
  };

  // Langkah 4.3: alamat berubah dibanding yang tersimpan
  const alamatBerubah = () =>
    customer.alamat.trim() !== alamatAsli.alamat ||
    (customer.labelAlamat || "").trim() !== alamatAsli.label ||
    (customer.catatanLokasi || "").trim() !== alamatAsli.catatan;

  // Langkah 4.4: validasi seluruh isian (jadwal lama boleh dipertahankan, jadi tanggal lampau tidak ditolak)
  const validasi = () => {
    const e = {};
    const telepon = customer.telepon.replace(/[\s-]/g, "");

    if (!/^\d{10,15}$/.test(telepon))
      e.telepon = "No. HP harus 10-15 digit angka";
    if (customer.nama.trim().length < 2) e.nama = "Nama minimal 2 karakter";
    if (
      (!customer.addressId || alamatBerubah()) &&
      customer.alamat.trim().length < 10
    ) {
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

    if (!jadwal.tanggal) e.tanggal = "Tanggal wajib diisi";
    if (!jadwal.jam) e.jam = "Jam wajib diisi";

    return e;
  };

  const lanjut = () => {
    const e = validasi();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    pindah(2);
  };

  // Langkah 4.5: simpan perubahan, lalu catat pelunasan jika dipilih
  const kirim = async () => {
    if (!setuju) {
      setErrors({ setuju: "Centang persetujuan pelanggan untuk melanjutkan" });
      return;
    }
    const e = validasi();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      pindah(1);
      return;
    }

    setSubmitting(true);
    setGagalKirim("");
    try {
      const diperbarui = await updateBooking(id, {
        pelanggan: customer.nama.trim(),
        telepon: customer.telepon.replace(/[\s-]/g, ""),
        // alamat diedit: kirim teks alamat (tanpa address_id) agar backend memperbarui data alamatnya
        alamatId: alamatBerubah() ? "" : customer.addressId,
        alamat: customer.alamat.trim(),
        labelAlamat: (customer.labelAlamat || "").trim(),
        catatanLokasi: (customer.catatanLokasi || "").trim(),
        catatan: catatanBooking, // dikirim ulang agar catatan booking tidak terhapus
        teknisiId,
        items: ringkasan.map((u) => ({
          unit: u.lokasi.trim(),
          merek: namaMerek(u),
          kapasitas: u.kapasitas,
          tipe: u.tipe,
          layananId: u.layanan?.id,
          catatan: u.catatan.trim(),
        })),
        ...jadwal,
      });

      // Langkah 4.6: sisa tagihan setelah harga dihitung ulang backend
      const sisaTagihan = Math.max(
        0,
        Number(diperbarui.total || 0) - sudahDibayar,
      );

      if (
        bayar.status === "lunas" &&
        sisaTagihan > 0 &&
        statusAwal !== "Dibatalkan"
      ) {
        try {
          await createTransaction({
            bookingId: diperbarui.id,
            metode: bayar.metode,
            jumlah: sisaTagihan,
            catatan: susunCatatanBayar(bayar) || "Pelunasan sisa tagihan",
          });
        } catch (errTx) {
          setGagalKirim(
            `Perubahan tersimpan, tetapi pembayaran gagal dicatat: ${pesanError(errTx)}`,
          );
          return;
        }

        // pelunasan membuat backend mengubah status menjadi Selesai, kembalikan ke status semula
        if (statusAwal !== "Selesai") {
          try {
            await updateBookingStatus(diperbarui, statusAwal);
          } catch {
            setGagalKirim(
              `Pembayaran tercatat, tetapi status booking berubah otomatis menjadi Selesai. Ubah kembali ke ${statusAwal} di menu Booking.`,
            );
            return;
          }
        }
      }

      // Langkah 4.7: teknisi dipilih tetapi backend belum menyimpannya
      if (
        teknisiId &&
        String(diperbarui.teknisiId || "") !== String(teknisiId)
      ) {
        setGagalKirim(
          "Perubahan tersimpan, tetapi teknisi belum tersimpan karena backend belum mendukung penugasan teknisi. Kembali ke daftar booking dengan tombol di atas.",
        );
        return;
      }

      navigate("/booking");
    } catch (err) {
      setGagalKirim(`Gagal memperbarui booking: ${pesanError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-500">
        <Loader2 className="animate-spin" size={18} /> Memuat data...
      </div>
    );
  }

  if (gagalMuat) {
    return (
      <div className="p-6">
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {gagalMuat}
        </p>
        <button
          onClick={() => navigate("/booking")}
          className="text-sm text-primary hover:underline"
        >
          ← Kembali ke Daftar Booking
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">
          Edit Booking Service
        </h1>
        <button
          type="button"
          onClick={() => navigate("/booking")}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          Kembali ke Daftar
        </button>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          {gagalKirim && (
            <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
              {gagalKirim}
            </p>
          )}

          <StepIndicator step={step} maxStep={maxStep} onJump={pindah} />

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              {step === 1 && (
                <div className="space-y-6">
                  <StepCustomer
                    data={customer}
                    errors={errors}
                    onChange={handleCustomer}
                    hideNavigation={true}
                  />

                  <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold uppercase text-slate-900">
                      Unit AC & Layanan
                    </h2>
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
                      className="mt-4 w-full rounded-lg border-2 border-dashed border-secondary/50 py-3 text-sm font-bold text-secondary hover:bg-soft/40 disabled:opacity-50"
                    >
                      + Tambah Unit AC Lainnya (Maks. {MAKS_UNIT} Unit)
                    </button>
                  </div>

                  <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold uppercase text-slate-900">
                      Jadwal & Teknisi
                    </h2>
                    <StepSchedule
                      jadwal={jadwal}
                      errors={errors}
                      jumlahUnit={units.length}
                      durasi={hitungDurasi(ringkasan)}
                      onTanggal={handleTanggal}
                      onJam={handleJam}
                      hideNavigation={true}
                    />

                    <div className="mt-4 border-t border-soft pt-4">
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
                          onChange={(ev) => setTeknisiId(ev.target.value)}
                          className="w-full rounded-lg border border-soft bg-white py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
                        >
                          <option value="">
                            -- Belum ditugaskan / Pilih nanti --
                          </option>
                          {teknisiList.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nama}
                              {t.telepon ? ` (${t.telepon})` : ""}
                              {t.status !== "Aktif" ? " - nonaktif" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={lanjut}
                      className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-secondary"
                    >
                      Lanjutkan ke Review & Simpan →
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <StepReview
                  customer={customer}
                  ringkasan={ringkasan}
                  jadwal={jadwal}
                  teknisi={teknisiTerpilih}
                  teknisiList={teknisiList}
                  bayar={bayar}
                  onBayarChange={setBayar}
                  setuju={setuju}
                  errors={errors}
                  submitting={submitting}
                  onSetuju={setSetuju}
                  onGo={pindah}
                  onBack={() => pindah(1)}
                  onSubmit={kirim}
                  sudahDibayar={sudahDibayar}
                />
              )}
            </div>

            <aside className="lg:sticky lg:top-6 lg:col-span-4">
              <BookingSummary items={ringkasan} sudahDibayar={sudahDibayar} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}