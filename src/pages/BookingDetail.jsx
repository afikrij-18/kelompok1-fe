// src/pages/BookingDetail.jsx
// Langkah 2: detail booking dengan pembayaran bertahap, cetak invoice per transaksi, dan cetak detail
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  Snowflake,
  CalendarCheck,
  Receipt,
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Printer,
  Clock,
  XCircle,
} from "lucide-react";
import { getBookingById } from "../services/bookingService";
import { createTransaction } from "../services/transactionService";
import {
  METODE,
  METODE_OPSI,
  formatWaktu,
} from "../services/transactionMapper";
import { formatRupiah } from "../utils/booking";
import {
  BANK_OPSI,
  hitungPembayaran,
  susunCatatanBayar,
} from "../utils/pembayaran";
import { cetakDokumen } from "../utils/cetak";
import { dokumenInvoice, dokumenDetailBooking } from "../utils/cetakBooking";
import CetakBookingDialog from "../components/booking/CetakBookingDialog";

const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

const badgeColor = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  Dikonfirmasi: "bg-soft text-primary",
  Selesai: "bg-green-100 text-green-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

// Langkah 2.1: tampilan tiap status transaksi
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

// Langkah 2.2: bentuk transaksi yang dipakai dokumen cetak (sama dengan transactionMapper)
const bentukCetak = (t) => ({
  id: t.id,
  invoice: t.invoice,
  waktuBayar: formatWaktu(t.tanggal),
  metode: METODE[t.metode] || t.metode,
  dibayar: t.jumlah,
  status: t.status,
  catatan: t.catatan,
});

const inputClass =
  "w-full rounded-lg border border-soft bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBayar, setShowBayar] = useState(false);
  const [bayar, setBayar] = useState({
    metode: "cash",
    bank: BANK_OPSI[0],
    jumlah: "",
    catatan: "",
  });
  const [errBayar, setErrBayar] = useState("");
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState(null);
  const [showCetak, setShowCetak] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError("");
    getBookingById(id)
      .then(setBooking)
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Langkah 2.3: satu sumber kebenaran untuk status pembayaran
  const transaksi = booking ? booking.transaksi || [] : [];
  const pay = booking ? hitungPembayaran(booking.total, transaksi) : null;
  const isPaid = pay ? pay.status === "Lunas" : false;
  const dibatalkan = booking ? booking.status === "Dibatalkan" : false;

  // Langkah 2.4: buka form pembayaran, jumlah awal = sisa tagihan
  const bukaBayar = () => {
    setErrBayar("");
    setBayar((b) => ({ ...b, jumlah: String(pay.sisa) }));
    setShowBayar(true);
  };

  // Langkah 2.5: simpan pembayaran, jumlah harus bilangan bulat dan tidak melebihi sisa
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

    setSaving(true);
    setPesan(null);
    setErrBayar("");
    try {
      await createTransaction({
        bookingId: booking.id,
        metode: bayar.metode,
        jumlah: nominal,
        catatan: susunCatatanBayar(bayar) || undefined,
      });

      const sisaBaru = pay.sisa - nominal;
      setPesan({
        tipe: "sukses",
        teks:
          sisaBaru === 0
            ? `Pembayaran ${formatRupiah(nominal)} tercatat. Tagihan lunas.`
            : `Pembayaran ${formatRupiah(nominal)} tercatat. Sisa tagihan ${formatRupiah(sisaBaru)}.`,
      });
      setShowBayar(false);
      setBayar((b) => ({ ...b, jumlah: "", catatan: "" }));
      fetchData();
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setSaving(false);
    }
  };

  // Langkah 2.6: cetak invoice untuk satu transaksi
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

  // Langkah 2.7: cetak detail booking sesuai keperluan yang dipilih di dialog
  const cetakDetail = (jenis) => {
    cetakDokumen({
      judul: `Detail Booking ${booking.kode}`,
      isi: dokumenDetailBooking({
        booking,
        transaksi: transaksi.map(bentukCetak),
        jenis,
      }),
    });
  };

  // Langkah 2.8: untuk warna hijau atau merah di Ringkasan Biaya, anggap layanan dibayar berurutan
  const paidPerUnit = (() => {
    let sisaTerbayar = pay ? pay.dibayar : 0;
    return (booking?.items || []).map((u) => {
      const harga = Number(u.harga || 0);
      const covered = Math.min(harga, sisaTerbayar);
      sisaTerbayar -= covered;
      return { harga, covered, lunas: harga > 0 && covered >= harga };
    });
  })();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-500">
        <Loader2 size={18} className="animate-spin" /> Memuat detail booking...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
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

  if (!booking) return null;

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <button
          onClick={() => navigate("/booking")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-primary">Detail Booking</h1>
          <p className="font-mono text-xs text-gray-500">
            {booking.kode} • {booking.jadwal} WIB
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {pay.sisa > 0 && pay.dibayar > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              Sebagian
            </span>
          )}
          {pay.sisa > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
              Kurang {formatRupiah(pay.sisa)}
            </span>
          )}
          {pay.lebih > 0 && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              Lebih bayar {formatRupiah(pay.lebih)}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor[booking.status] || "bg-gray-100 text-gray-700"}`}
          >
            {booking.status}
          </span>
          {/* Langkah 2.9: cetak detail booking, keperluannya dipilih di dialog */}
          <button
            type="button"
            onClick={() => setShowCetak(true)}
            className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-xs font-bold text-primary hover:bg-soft"
          >
            <Printer size={14} /> Cetak Detail
          </button>
        </div>
      </header>

      <main className="p-6">
        {pesan && (
          <div
            className={`mb-4 rounded-lg px-4 py-2 text-sm ${pesan.tipe === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {pesan.teks}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* KIRI: Detail Booking */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-soft bg-white p-5 shadow">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-primary">
                  <User size={18} />
                </span>
                Pelanggan & Lokasi
              </h2>
              <div className="rounded-lg bg-soft/30 p-4">
                <p className="text-base font-bold text-primary">
                  {booking.pelanggan}
                </p>
                <p className="text-sm text-slate-700">
                  WhatsApp: <strong>{booking.telepon}</strong>
                </p>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span>
                  {booking.labelAlamat && (
                    <span className="mr-1 rounded bg-soft px-1.5 py-0.5 text-xs font-bold text-primary">
                      {booking.labelAlamat}
                    </span>
                  )}
                  {booking.alamat}
                </span>
              </p>
              {booking.catatanLokasi && (
                <p className="mt-1 pl-6 text-xs text-slate-400">
                  Patokan: {booking.catatanLokasi}
                </p>
              )}
              {booking.catatan && (
                <p className="mt-2 text-xs italic text-slate-500">
                  Catatan booking: {booking.catatan}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-soft bg-white p-5 shadow">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-primary">
                  <Snowflake size={18} />
                </span>
                Rincian Unit AC ({booking.items.length} Unit)
              </h2>
              <div className="space-y-3">
                {booking.items.map((u, i) => (
                  <div
                    key={u.id}
                    className={`rounded-lg border p-4 transition ${paidPerUnit[i]?.lunas ? "border-green-200 bg-green-50/40" : "border-soft bg-white"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">
                        <span
                          className={`mr-2 rounded px-2 py-0.5 text-xs ${paidPerUnit[i]?.lunas ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}
                        >
                          Unit #{i + 1}{" "}
                          {paidPerUnit[i]?.lunas ? "(Lunas)" : "(Belum)"}
                        </span>
                        {u.layanan}
                      </p>
                      <p className="shrink-0 text-xs font-bold text-slate-900">
                        {formatRupiah(u.harga)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {u.merek} {u.kapasitas} ({u.tipe}) • Lokasi: {u.unit}
                    </p>
                    {u.catatan && (
                      <p className="mt-1 text-xs italic text-slate-400">
                        Keluhan: {u.catatan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-soft bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-primary">
                  <CalendarCheck size={18} />
                </span>
                Jadwal Kedatangan
              </h2>
              <div className="rounded-lg bg-soft/30 p-4">
                <p className="text-base font-bold text-primary">
                  {booking.jadwal} WIB
                </p>
                <p className="text-xs text-slate-500">
                  Tanggal: {booking.tanggal} • Jam: {booking.jam} WIB
                </p>
              </div>
            </div>

            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-lg border border-soft bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-soft"
            >
              <ArrowLeft size={18} /> Kembali ke Daftar Booking
            </Link>
          </div>

          {/* KANAN: Detail Pembayaran dan Ringkasan Biaya */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-xl border border-secondary/30 bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-secondary">
                  <CreditCard size={18} />
                </span>
                Detail Pembayaran
              </h2>

              <div
                className={`mb-4 rounded-lg border p-3 ${isPaid ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Sisa Tagihan Belum Dibayar
                </p>
                <p
                  className={`text-2xl font-bold ${isPaid ? "text-green-700" : "text-red-600"}`}
                >
                  {isPaid ? "LUNAS" : formatRupiah(pay.sisa)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Total {formatRupiah(booking.total)} • Sudah dibayar{" "}
                  {formatRupiah(pay.dibayar)}
                </p>
              </div>

              {/* Langkah 2.10: riwayat transaksi, tiap transaksi punya tombol cetak invoice */}
              {transaksi.length > 0 && (
                <div className="mb-4 space-y-2">
                  {transaksi.map((t) => {
                    const tampil =
                      TAMPIL_TRANSAKSI[t.status] || TAMPIL_TRANSAKSI.pending;
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

              {/* Langkah 2.11: tombol bayar, hilang saat lunas atau dibatalkan */}
              {isPaid ? (
                <div className="flex items-center gap-2 rounded-lg bg-soft/40 px-3 py-2 text-xs text-slate-500">
                  <Wallet size={14} /> Tagihan sudah lunas, tidak perlu bayar
                  lagi.
                </div>
              ) : dibatalkan ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  <AlertCircle size={14} /> Booking dibatalkan, pembayaran tidak
                  dapat dicatat.
                </div>
              ) : (
                <div>
                  {!showBayar ? (
                    <button
                      type="button"
                      onClick={bukaBayar}
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary"
                    >
                      Catat Pembayaran
                    </button>
                  ) : (
                    <div className="space-y-3 rounded-lg border border-soft bg-soft/20 p-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Metode Pembayaran
                        </label>
                        <select
                          value={bayar.metode}
                          onChange={(e) =>
                            setBayar({ ...bayar, metode: e.target.value })
                          }
                          className={inputClass}
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
                            Bank Tujuan
                          </label>
                          <select
                            value={bayar.bank}
                            onChange={(e) =>
                              setBayar({ ...bayar, bank: e.target.value })
                            }
                            className={inputClass}
                          >
                            {BANK_OPSI.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
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
                              setBayar({ ...bayar, jumlah: String(pay.sisa) });
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
                          className={`${inputClass} ${errBayar ? "border-red-500" : ""}`}
                        />
                        {errBayar ? (
                          <p className="mt-1 text-xs text-red-600">
                            {errBayar}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-400">
                            Boleh kurang dari sisa (DP atau cicilan), maksimal{" "}
                            {formatRupiah(pay.sisa)}.
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
                          className={inputClass}
                        />
                      </div>

                      {/* peringatan: backend mengubah status booking menjadi Selesai saat tagihan lunas */}
                      {Number(bayar.jumlah) === pay.sisa &&
                        booking.status !== "Selesai" && (
                          <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                            <AlertCircle
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                            Melunasi tagihan membuat sistem mengubah status
                            booking menjadi Selesai.
                          </p>
                        )}

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleBayar}
                          disabled={saving}
                          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
                        >
                          {saving ? "Menyimpan..." : "Simpan Pembayaran"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBayar(false)}
                          disabled={saving}
                          className="rounded-lg border border-soft bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-soft disabled:opacity-60"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ringkasan Biaya: hijau = sudah dibayar, merah = belum dibayar */}
            <div className="rounded-xl border border-soft bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <Receipt size={18} className="text-secondary" /> Ringkasan Biaya
              </h2>

              <div className="space-y-2 text-sm">
                {booking.items.map((u, i) => {
                  const lunas = paidPerUnit[i]?.lunas;
                  return (
                    <div
                      key={u.id}
                      className={`flex justify-between gap-2 rounded-lg border px-3 py-2 ${lunas ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${lunas ? "bg-green-500" : "bg-red-500"}`}
                        />
                        {u.layanan} (#{i + 1})
                      </span>
                      <span className="shrink-0 font-bold">
                        {formatRupiah(u.harga)}
                      </span>
                    </div>
                  );
                })}
                {booking.items.length === 0 && (
                  <p className="text-xs text-slate-400">Tidak ada layanan.</p>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Sudah
                  dibayar
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Belum
                  dibayar
                </span>
              </div>

              <div className="mt-3 border-t border-soft pt-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Total tagihan</span>
                  <span className="font-bold text-slate-900">
                    {formatRupiah(booking.total)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Sudah dibayar</span>
                  <span className="font-bold text-green-700">
                    {formatRupiah(pay.dibayar)}
                  </span>
                </div>
                {pay.lebih > 0 && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Kelebihan bayar</span>
                    <span className="font-bold text-blue-700">
                      {formatRupiah(pay.lebih)}
                    </span>
                  </div>
                )}
                <div className="mt-2">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Sisa Tagihan Belum Dibayar
                  </span>
                  <p
                    className={`text-2xl font-bold ${isPaid ? "text-green-700" : "text-red-600"}`}
                  >
                    {isPaid ? "LUNAS (Rp 0)" : formatRupiah(pay.sisa)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Langkah 2.12: dialog pilihan keperluan cetak detail booking */}
      {showCetak && (
        <CetakBookingDialog
          booking={booking}
          onCetak={cetakDetail}
          onClose={() => setShowCetak(false)}
        />
      )}
    </>
  );
}