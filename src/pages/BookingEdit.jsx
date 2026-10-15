// src/pages/BookingEdit.jsx
// Edit booking - satu halaman penuh tanpa stepper, card kanan sama dengan Detail Booking
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Wrench,
  Loader2,
  Receipt,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
  AlertCircle,
} from "lucide-react";
import StepCustomer from "../components/booking/StepCustomer";
import StepUnits from "../components/booking/StepUnits";
import StepSchedule from "../components/booking/StepSchedule";
import { getServices } from "../services/serviceService";
import { getBookingById, updateBooking } from "../services/bookingService";
import { getTechnicians } from "../services/technicianService";
import { MAKS_UNIT } from "../data/bookingOptions";
import {
  formatRupiah,
  hitungDurasi,
  namaMerek,
  inputClass,
} from "../utils/booking";
import {
  hitungPembayaran,
  susunCatatanBayar,
} from "../utils/pembayaran";
import { getBanks } from "../services/expenseService";
import {
  METODE,
  METODE_OPSI,
  formatWaktu,
} from "../services/transactionMapper";
import { createTransaction } from "../services/transactionService";
import { cetakDokumen } from "../utils/cetak";
import { dokumenInvoice } from "../utils/cetakBooking";

const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

const TAMPIL_TRANSAKSI = {
  paid: {
    kotak: "border-green-200 bg-green-50",
    teks: "text-green-700",
    label: "Diterima",
    icon: CheckCircle2,
  },
  pending: {
    kotak: "border-amber-200 bg-amber-50",
    teks: "text-amber-700",
    label: "Menunggu",
    icon: Clock,
  },
  failed: {
    kotak: "border-red-200 bg-red-50",
    teks: "text-red-700",
    label: "Gagal",
    icon: XCircle,
  },
};

const bentukCetak = (t) => ({
  id: t.id,
  invoice: t.invoice,
  waktuBayar: formatWaktu(t.tanggal),
  metode: METODE[t.metode] || t.metode,
  dibayar: t.jumlah,
  status: t.status,
  catatan: t.catatan,
});

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gagalMuat, setGagalMuat] = useState("");

  const [booking, setBooking] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [alamatAsli, setAlamatAsli] = useState({
    alamat: "",
    label: "",
    catatan: "",
  });
  const [catatanBooking, setCatatanBooking] = useState("");
  const [units, setUnits] = useState([]);
  const [jadwal, setJadwal] = useState({ tanggal: "", jam: "" });
  const [teknisiId, setTeknisiId] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [gagalKirim, setGagalKirim] = useState("");

  const [showBayar, setShowBayar] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [bayar, setBayar] = useState({
    metode: "cash",
    bank: "",
    bankId: "",
    jumlah: "",
    catatan: "",
  });
  const [errBayar, setErrBayar] = useState("");
  const [savingBayar, setSavingBayar] = useState(false);
  const [pesanBayar, setPesanBayar] = useState(null);

  const [layananList, setLayananList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);

  useEffect(() => {
    let batal = false;
    Promise.all([getServices(), getBookingById(id), getTechnicians()])
      .then(([services, b, technicians]) => {
        if (batal) return;
        setLayananList(services);
        setTeknisiList(
          technicians.filter(
            (t) => t.status === "Aktif" || String(t.id) === String(b.teknisiId),
          ),
        );
        setBooking(b);
        setCustomer({
          nama: b.pelanggan,
          telepon: b.telepon,
          addressId: b.alamatId,
          alamat: b.alamat,
          labelAlamat: b.labelAlamat,
          catatanLokasi: b.catatanLokasi,
        });
        setAlamatAsli({
          alamat: b.alamat,
          label: b.labelAlamat,
          catatan: b.catatanLokasi,
        });
        setCatatanBooking(b.catatan);
        setUnits(
          b.items.map((it, idx) => ({
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
        setJadwal({ tanggal: b.tanggal, jam: b.jam });
        setTeknisiId(b.teknisiId || "");
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

  const transaksi = booking ? booking.transaksi || [] : [];
  const pay = booking ? hitungPembayaran(booking.total, transaksi) : null;
  // preview total dari form saat ini (untuk card kanan)
  const totalPreview = ringkasan.reduce(
    (s, u) => s + Number(u.layanan?.harga || 0),
    0,
  );
  const sudahDibayar = pay ? pay.dibayar : 0;
  const sisaPreview = Math.max(0, totalPreview - sudahDibayar);
  const isPaidPreview = totalPreview > 0 && sudahDibayar >= totalPreview;

  const paidPerUnit = (() => {
    let sisaTerbayar = sudahDibayar;
    return ringkasan.map((u) => {
      const harga = Number(u.layanan?.harga || 0);
      const covered = Math.min(harga, sisaTerbayar);
      sisaTerbayar -= covered;
      return { harga, covered, lunas: harga > 0 && covered >= harga };
    });
  })();

  const teknisiTerpilih = teknisiList.find(
    (t) => String(t.id) === String(teknisiId),
  );

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

  const alamatBerubah = () =>
    customer.alamat.trim() !== alamatAsli.alamat ||
    (customer.labelAlamat || "").trim() !== alamatAsli.label ||
    (customer.catatanLokasi || "").trim() !== alamatAsli.catatan;

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

  const kirim = async () => {
    const e = validasi();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setGagalKirim("");
    try {
      await updateBooking(id, {
        pelanggan: customer.nama.trim(),
        telepon: customer.telepon.replace(/[\s-]/g, ""),
        alamatId: alamatBerubah() ? "" : customer.addressId,
        alamat: customer.alamat.trim(),
        labelAlamat: (customer.labelAlamat || "").trim(),
        catatanLokasi: (customer.catatanLokasi || "").trim(),
        catatan: catatanBooking,
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
      navigate("/booking");
    } catch (err) {
      setGagalKirim(`Gagal memperbarui booking: ${pesanError(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const cetakInvoice = (t) => {
    cetakDokumen({
      judul: `Invoice ${t.invoice}`,
      isi: dokumenInvoice({
        booking,
        transaksi: bentukCetak(t),
        semuaTransaksi: transaksi.map(bentukCetak),
      }),
    });
  };

  const muatUlangBooking = async () => {
    const b = await getBookingById(id);
    setBooking(b);
    return b;
  };

  const dibatalkan = booking ? booking.status === "Dibatalkan" : false;
  const isPaid = pay ? pay.status === "Lunas" : false;

  // Highlight: deteksi perubahan vs data asli
  const hasChangedCustomer =
    customer &&
    booking &&
    (customer.nama.trim() !== booking.pelanggan ||
      customer.telepon.replace(/[\s-]/g, "") !== booking.telepon ||
      customer.alamat.trim() !== booking.alamat ||
      (customer.labelAlamat || "").trim() !== (booking.labelAlamat || "") ||
      (customer.catatanLokasi || "").trim() !== (booking.catatanLokasi || ""));

  const hasChangedJadwal =
    booking &&
    (jadwal.tanggal !== booking.tanggal ||
      jadwal.jam !== booking.jam ||
      String(teknisiId) !== String(booking.teknisiId || "") ||
      catatanBooking !== (booking.catatan || ""));

  const changedUnitIdx = booking
    ? units.map((u, i) => {
        const bItem = booking.items[i];
        if (!bItem) return true;
        return (
          u.lokasi.trim() !== bItem.unit ||
          u.merek !== bItem.merek ||
          u.kapasitas !== bItem.kapasitas ||
          u.tipe !== bItem.tipe ||
          String(u.layananId) !== String(bItem.layananId) ||
          u.catatan.trim() !== (bItem.catatan || "")
        );
      })
    : [];
  const hasChangedUnits =
    booking &&
    (units.length !== booking.items.length || changedUnitIdx.some(Boolean));

  useEffect(() => {
    if (showBayar && banks.length === 0) {
      setLoadingBanks(true);
      getBanks("active")
        .then((list) => {
          setBanks(list);
          if (list.length > 0) {
            setBayar((b) => (b.bankId ? b : { ...b, bankId: String(list[0].id), bank: list[0].nama }));
          }
        })
        .catch(() => {})
        .finally(() => setLoadingBanks(false));
    }
  }, [showBayar]);

  const bukaBayar = () => {
    setErrBayar("");
    setPesanBayar(null);
    setBayar((b) => ({ ...b, jumlah: String(pay.sisa) }));
    setShowBayar(true);
  };

  const handleBayar = async () => {
    const nominal = Number(bayar.jumlah);
    if (!bayar.jumlah || !Number.isInteger(nominal) || nominal <= 0) {
      setErrBayar("Jumlah harus berupa angka bulat lebih dari 0");
      return;
    }
    if (nominal > pay.sisa) {
      setErrBayar(`Jumlah melebihi sisa tagihan (${formatRupiah(pay.sisa)})`);
      return;
    }
    if (bayar.metode === "transfer_bank" && !bayar.bankId) {
      setErrBayar("Pilih bank tujuan transfer");
      return;
    }

    setSavingBayar(true);
    setPesanBayar(null);
    setErrBayar("");
    try {
      const namaBank = (banks.find((b) => String(b.id) === String(bayar.bankId))?.nama) || bayar.bank || "";
      await createTransaction({
        bookingId: booking.id,
        metode: bayar.metode,
        bankId: bayar.metode === "transfer_bank" ? bayar.bankId : undefined,
        jumlah: nominal,
        catatan: susunCatatanBayar({ ...bayar, bank: namaBank }, banks) || undefined,
      });

      const bBaru = await muatUlangBooking();
      const payBaru = hitungPembayaran(bBaru.total, bBaru.transaksi || []);
      setPesanBayar({
        tipe: "sukses",
        teks:
          payBaru.sisa === 0
            ? `Pembayaran ${formatRupiah(nominal)} tercatat. Tagihan lunas.`
            : `Pembayaran ${formatRupiah(nominal)} tercatat. Sisa tagihan ${formatRupiah(payBaru.sisa)}.`,
      });
      setShowBayar(false);
      setBayar((b) => ({ ...b, jumlah: "", catatan: "" }));
    } catch (err) {
      setPesanBayar({ tipe: "error", teks: pesanError(err) });
    } finally {
      setSavingBayar(false);
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

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* KIRI: Form satu halaman */}
            <div className="space-y-6 lg:col-span-8">
              <div
                className={`rounded-xl p-1 transition ${
                  hasChangedCustomer
                    ? "border-2 border-amber-300 bg-amber-50/50 ring-1 ring-amber-200"
                    : "border border-transparent"
                }`}
              >
                {hasChangedCustomer && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                    ● Data Pelanggan Berubah
                  </span>
                )}
                <StepCustomer
                  data={customer}
                  errors={errors}
                  onChange={handleCustomer}
                  hideNavigation={true}
                />
              </div>

              <div
                className={`rounded-xl border p-6 shadow-sm transition ${
                  hasChangedUnits
                    ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-200"
                    : "border-soft bg-white"
                }`}
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase text-slate-900">
                  Unit AC & Layanan
                  {hasChangedUnits && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold normal-case text-amber-700">
                      ● Berubah
                    </span>
                  )}
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
                  changedIdx={changedUnitIdx}
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

              <div
                className={`rounded-xl border p-6 shadow-sm transition ${
                  hasChangedJadwal
                    ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-200"
                    : "border-soft bg-white"
                }`}
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase text-slate-900">
                  Jadwal & Teknisi
                  {hasChangedJadwal && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold normal-case text-amber-700">
                      ● Berubah
                    </span>
                  )}
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
                  {teknisiTerpilih && (
                    <p className="mt-1 text-xs text-slate-500">
                      Terpilih: {teknisiTerpilih.nama}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <Link
                  to={`/booking/${id}`}
                  className="rounded-lg border border-soft bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-soft"
                >
                  Batal
                </Link>
                <button
                  type="button"
                  onClick={kirim}
                  disabled={submitting}
                  className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>

            {/* KANAN: Card gabungan Ringkasan Biaya + Detail Pembayaran (sama dengan Detail Booking, preview dari form) */}
            <aside className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
              <div className="rounded-xl border border-secondary/30 bg-white p-5 shadow">
                {/* BAGIAN ATAS: Ringkasan Biaya (preview) */}
                <div className="border-b border-soft pb-5">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                    <Receipt size={18} className="text-secondary" /> Ringkasan
                    Biaya
                  </h2>
                  <div className="space-y-2 text-sm">
                    {ringkasan.map((u, i) => {
                      const lunas = paidPerUnit[i]?.lunas;
                      return (
                        <div
                          key={u.uid}
                          className={`flex justify-between gap-2 rounded-lg border px-3 py-2 ${lunas ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${lunas ? "bg-green-500" : "bg-red-500"}`}
                            />
                            {u.layanan?.nama || "Pilih layanan"} (#{i + 1})
                          </span>
                          <span className="shrink-0 font-bold">
                            {formatRupiah(u.layanan?.harga || 0)}
                          </span>
                        </div>
                      );
                    })}
                    {ringkasan.length === 0 && (
                      <p className="text-xs text-slate-400">Belum ada unit.</p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500" />{" "}
                      Sudah dibayar
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Belum
                      dibayar
                    </span>
                  </div>
                </div>

                {/* BAGIAN BAWAH: Detail Pembayaran */}
                <div className="pt-5">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-soft text-secondary">
                      <CreditCard size={16} />
                    </span>
                    Detail Pembayaran
                  </h2>

                  {pesanBayar && (
                    <div
                      className={`mb-3 rounded-lg px-3 py-2 text-xs ${pesanBayar.tipe === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {pesanBayar.teks}
                    </div>
                  )}

                  <div
                    className={`mb-4 rounded-lg border p-3 ${isPaid ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Sisa Tagihan
                    </p>
                    <p
                      className={`text-2xl font-bold ${isPaid ? "text-green-700" : "text-red-600"}`}
                    >
                      {isPaid ? "LUNAS" : formatRupiah(pay.sisa)}
                    </p>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Total</span>
                      <span className="font-bold text-slate-900">
                        {formatRupiah(totalPreview)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Sudah dibayar</span>
                      <span className="font-bold text-green-700">
                        {formatRupiah(sudahDibayar)}
                      </span>
                    </div>
                    {pay && pay.lebih > 0 && (
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Kelebihan bayar</span>
                        <span className="font-bold text-blue-700">
                          {formatRupiah(pay.lebih)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tombol Catat Pembayaran / Form */}
                  {isPaid ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-soft/40 px-3 py-2 text-xs text-slate-500">
                      <Wallet size={14} /> Tagihan sudah lunas, tidak perlu
                      bayar lagi.
                    </div>
                  ) : dibatalkan ? (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                      <AlertCircle size={14} /> Booking dibatalkan, pembayaran
                      tidak dapat dicatat.
                    </div>
                  ) : (
                    <div className="mb-4">
                      {!showBayar ? (
                        <button
                          type="button"
                          onClick={bukaBayar}
                          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-secondary"
                        >
                          Catat Pembayaran
                        </button>
                      ) : (
                        <div className="space-y-3 rounded-lg border border-soft bg-soft/20 p-3">
                          <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700">
                              Metode Pembayaran
                            </label>
                            <select
                              value={bayar.metode}
                              onChange={(e) =>
                                setBayar({ ...bayar, metode: e.target.value })
                              }
                              className={inputClass(false)}
                            >
                              {METODE_OPSI.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {bayar.metode === "transfer_bank" && (
                            <div>
                              <label className="mb-1 block text-xs font-bold text-slate-700">
                                Bank Tujuan {loadingBanks && <span className="text-xs text-slate-400">(memuat...)</span>}
                              </label>
                              <select
                                value={bayar.bankId || ""}
                                onChange={(e) => {
                                  const hit = banks.find((b) => String(b.id) === e.target.value);
                                  setBayar({ ...bayar, bankId: e.target.value, bank: hit ? hit.nama : "" });
                                }}
                                className={inputClass(false)}
                              >
                                {banks.length === 0 ? (
                                  <option value="">{loadingBanks ? "Memuat bank..." : "-- Tidak ada bank --"}</option>
                                ) : (
                                  banks.map((b) => (
                                    <option key={b.id} value={b.id}>
                                      {b.nama}
                                    </option>
                                  ))
                                )}
                              </select>
                            </div>
                          )}

                          <div>
                            <div className="mb-1 flex items-center justify-between">
                              <label className="text-xs font-bold text-slate-700">
                                Jumlah Dibayar (Rp)
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setErrBayar("");
                                  setBayar({
                                    ...bayar,
                                    jumlah: String(pay.sisa),
                                  });
                                }}
                                className="text-[11px] font-bold text-secondary hover:underline"
                              >
                                Lunasi sisa
                              </button>
                            </div>
                            <input
                              type="number"
                              min="1"
                              max={pay.sisa}
                              value={bayar.jumlah}
                              onChange={(e) => {
                                setErrBayar("");
                                setBayar({ ...bayar, jumlah: e.target.value });
                              }}
                              className={`${inputClass(false)} ${errBayar ? "border-red-500" : ""}`}
                            />
                            {errBayar ? (
                              <p className="mt-1 text-xs text-red-600">
                                {errBayar}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-slate-400">
                                Maksimal {formatRupiah(pay.sisa)}.
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700">
                              Catatan (opsional)
                            </label>
                            <input
                              type="text"
                              placeholder={
                                bayar.metode === "transfer_bank"
                                  ? "No. referensi / keterangan"
                                  : "Catatan pembayaran"
                              }
                              value={bayar.catatan}
                              onChange={(e) =>
                                setBayar({ ...bayar, catatan: e.target.value })
                              }
                              className={inputClass(false)}
                            />
                          </div>

                          {Number(bayar.jumlah) === pay.sisa &&
                            booking.status !== "Selesai" && (
                              <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                                <AlertCircle
                                  size={14}
                                  className="mt-0.5 shrink-0"
                                />
                                Melunasi tagihan mengubah status booking menjadi
                                Selesai.
                              </p>
                            )}

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleBayar}
                              disabled={savingBayar}
                              className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-secondary disabled:opacity-60"
                            >
                              {savingBayar
                                ? "Menyimpan..."
                                : "Simpan Pembayaran"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBayar(false)}
                              disabled={savingBayar}
                              className="rounded-lg border border-soft bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-soft disabled:opacity-60"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {transaksi.length > 0 && (
                    <div className="space-y-2">
                      {transaksi.map((t) => {
                        const tampil =
                          TAMPIL_TRANSAKSI[t.status] ||
                          TAMPIL_TRANSAKSI.pending;
                        const Ikon = tampil.icon;
                        return (
                          <div
                            key={t.id}
                            className={`rounded-lg border p-3 ${tampil.kotak}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`flex items-center gap-2 text-sm font-bold ${tampil.teks}`}
                              >
                                <Ikon size={16} /> {formatRupiah(t.jumlah)}
                              </p>
                              <span
                                className={`rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase ${tampil.teks}`}
                              >
                                {tampil.label}
                              </span>
                            </div>
                            <div className="mt-1 space-y-1 text-xs text-slate-600">
                              <p>
                                Metode:{" "}
                                <strong className="text-slate-900">
                                  {METODE[t.metode] || t.metode}
                                </strong>{" "}
                                • Invoice{" "}
                                <strong className="font-mono text-slate-900">
                                  {t.invoice}
                                </strong>
                              </p>
                              {t.tanggal && (
                                <p>Tanggal: {formatWaktu(t.tanggal)}</p>
                              )}
                            </div>
                            {t.catatan && (
                              <p className="mt-2 border-t border-black/10 pt-2 text-xs italic text-slate-500">
                                Catatan: {t.catatan}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => cetakInvoice(t)}
                              className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                            >
                              <Printer size={13} /> Cetak Invoice
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {transaksi.length === 0 && (
                    <p className="rounded-lg bg-soft/40 px-3 py-2 text-xs text-slate-500">
                      Belum ada pembayaran untuk booking ini.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
