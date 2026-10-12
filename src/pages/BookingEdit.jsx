import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StepIndicator from "../components/booking/StepIndicator";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import StepReview from "../components/booking/StepReview";
import BookingSummary from "../components/booking/BookingSummary";
import { getServices } from "../services/serviceService";
import { getBookingById, updateBooking } from "../services/bookingService";
import { getUsers } from "../services/userService";
import { createTransaction } from "../services/transactionService";
import { METODE } from "../services/transactionMapper";
import { Wrench, Loader2 } from "lucide-react";
import { MAKS_UNIT } from "../data/bookingOptions";
import { hitungDurasi } from "../utils/booking";

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [customer, setCustomer] = useState(null);
  const [units, setUnits] = useState([]);
  const [jadwal, setJadwal] = useState({ tanggal: "", jam: "" });
  const [teknisiId, setTeknisiId] = useState("");
  const [bayar, setBayar] = useState({ status: "belum", metode: "cash", bank: "BCA", catatan: "" });
  const [sudahDibayar, setSudahDibayar] = useState(0);
  const [setuju, setSetuju] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [layananList, setLayananList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);

  useEffect(() => {
    Promise.all([getServices(), getBookingById(id), getUsers()])
      .then(([services, booking, users]) => {
        setLayananList(services);
        setTeknisiList(users.filter(u => u.role === "Teknisi" || u.role === "Admin"));
        
        setCustomer({
          nama: booking.pelanggan,
          telepon: booking.telepon,
          addressId: booking.alamatId,
          alamat: booking.alamat,
          labelAlamat: booking.labelAlamat,
          catatanLokasi: booking.catatanLokasi,
        });
        setUnits(booking.items.map((it, idx) => ({
          uid: idx + 1,
          lokasi: it.unit,
          merek: it.merek,
          kapasitas: it.kapasitas,
          tipe: it.tipe,
          layananId: it.layananId,
          catatan: it.catatan,
        })));
        setJadwal({ tanggal: booking.tanggal, jam: booking.jam });
        setTeknisiId(booking.teknisiId || "");
        
        // Cek apakah booking sudah lunas sebelumnya
        const paidTx = (booking.transaksi || []).filter(t => t.status === "paid" || t.payment_status === "paid");
        const totalPaid = paidTx.reduce((sum, t) => sum + Number(t.jumlah || t.amount_paid || 0), 0);
        setSudahDibayar(totalPaid);
        // Default pilihan bayar:
        // Jika ada transaksi sebelumnya, gunakan metode pembayaran yang pernah dipakai,
        // tetapi status di-set "belum" agar admin yang menentukan apakah sisa mau dilunasi sekarang atau nanti
        setBayar({
          status: "belum",
          metode: paidTx[0]?.metode || "cash",
          bank: "BCA",
          catatan: totalPaid > 0 ? "Pelunasan sisa tagihan" : "",
        });

        setLoading(false);
      });
  }, [id]);

  const ringkasan = units.map((u) => ({
    ...u,
    layanan: layananList.find((l) => String(l.id) === String(u.layananId)),
  }));

  const teknisiTerpilih = teknisiList.find((t) => String(t.id) === String(teknisiId));

  const pindah = (n) => {
    setStep(n);
    setMaxStep((m) => Math.max(m, Math.min(n, 2)));
  };

  const handleUnit = (uid, field, value) => {
    setUnits(units.map((u) => (u.uid === uid ? { ...u, [field]: value } : u)));
  };

  const addUnit = () => {
    if (units.length < MAKS_UNIT) {
      setUnits([...units, { uid: Date.now(), merek: "Daikin", kapasitas: "1 PK", tipe: "Split Wall", lokasi: "", layananId: "", catatan: "" }]);
    }
  };

  const removeUnit = (uid) => setUnits(units.filter((u) => u.uid !== uid));

  const handleTanggal = (iso) => setJadwal((j) => ({ ...j, tanggal: iso }));
  const handleJam = (jam) => setJadwal((j) => ({ ...j, jam }));

  const validasiLangkah1 = () => {
    const e = {};
    if (!customer?.nama?.trim()) e.nama = "Nama wajib diisi";
    if (!customer?.telepon?.trim()) e.telepon = "Telepon wajib diisi";
    if (!jadwal.tanggal) e.tanggal = "Tanggal wajib diisi";
    if (!jadwal.jam) e.jam = "Jam wajib diisi";
    return e;
  };

  const lanjut = () => {
    const e = validasiLangkah1();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    pindah(2);
  };

  const kirim = async () => {
    if (!setuju) {
      setErrors({ setuju: "Centang persetujuan pelanggan untuk melanjutkan" });
      return;
    }
    setSubmitting(true);
    try {
      const diperbarui = await updateBooking(id, {
        pelanggan: customer.nama,
        telepon: customer.telepon,
        alamatId: customer.addressId,
        alamat: customer.alamat,
        labelAlamat: customer.labelAlamat,
        catatanLokasi: customer.catatanLokasi,
        items: ringkasan.map((u) => ({
          unit: u.lokasi.trim(),
          merek: u.merek,
          kapasitas: u.kapasitas,
          tipe: u.tipe,
          layananId: u.layanan?.id,
          catatan: u.catatan.trim(),
        })),
        ...jadwal,
        teknisi_id: teknisiId || null,
      });

      // Hitung sisa tagihan yang perlu dibayar
      const totalBaru = (diperbarui.total || 0);
      const sisaTagihan = totalBaru - sudahDibayar;

      // Jika user memilih "Lunas sekarang" DAN masih ada sisa tagihan > 0
      if (bayar.status === "lunas" && sisaTagihan > 0) {
        try {
          const catatanBayar =
            bayar.metode === "transfer_bank"
              ? `Transfer ${bayar.bank} - ${bayar.catatan}`.trim()
              : bayar.catatan.trim();

          await createTransaction({
            bookingId: diperbarui.id,
            metode: bayar.metode,
            jumlah: sisaTagihan,
            catatan: catatanBayar || "Pelunasan sisa tagihan edit booking",
          });
        } catch (errTx) {
          alert("Booking tersimpan, tetapi pencatatan pelunasan gagal: " + errTx.message);
        }
      }

      navigate("/booking");
    } catch (e) {
      alert("Gagal memperbarui booking: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 flex items-center gap-2 text-sm text-gray-500"><Loader2 className="animate-spin" size={18}/> Memuat data...</div>;

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">Edit Booking Service</h1>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <StepIndicator step={step} maxStep={maxStep} onJump={pindah} />

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <StepCustomer
                    data={customer}
                    errors={errors}
                    onChange={(e) => setCustomer({ ...customer, [e.target.name]: e.target.value })}
                    hideNavigation={true}
                  />

                  <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold uppercase text-slate-900">Unit AC & Layanan</h2>
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
                    <h2 className="mb-4 text-lg font-bold uppercase text-slate-900">Jadwal & Teknisi</h2>
                    <StepSchedule
                      jadwal={jadwal}
                      errors={errors}
                      jumlahUnit={units.length}
                      durasi={hitungDurasi(ringkasan)}
                      onTanggal={handleTanggal}
                      onJam={handleJam}
                      hideNavigation={true}
                    />

                    <div className="mt-4 pt-4 border-t border-soft">
                      <label htmlFor="teknisi" className="mb-1 block text-xs font-bold text-slate-800">
                        Pilih Teknisi Tersedia <span className="font-normal text-slate-400">(opsional)</span>
                      </label>
                      <div className="relative">
                        <Wrench size={18} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
                        <select
                          id="teknisi"
                          value={teknisiId}
                          onChange={(e) => setTeknisiId(e.target.value)}
                          className="w-full rounded-lg border border-soft bg-white py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
                        >
                          <option value="">-- Belum ditugaskan / Pilih nanti --</option>
                          {teknisiList.map((t) => (
                            <option key={t.id} value={t.id}>{t.nama} ({t.role})</option>
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
