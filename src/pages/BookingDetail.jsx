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
  FileText,
} from "lucide-react";
import { getBookingById } from "../services/bookingService";
import { createTransaction } from "../services/transactionService";
import { METODE, METODE_OPSI } from "../services/transactionMapper";
import { formatRupiah } from "../utils/booking";

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

const BANK_OPSI = ["BCA", "Mandiri", "BNI", "BRI"];

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBayar, setShowBayar] = useState(false);
  const [bayar, setBayar] = useState({ metode: "cash", bank: "BCA", catatan: "" });
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState(null);

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

  const totalDibayar = booking ? (booking.totalDibayar ?? (booking.transaksi || []).reduce((j, t) => j + Number(t.jumlah || 0), 0)) : 0;
  const sisa = booking ? Math.max(0, booking.total - totalDibayar) : 0;
  const isPaid = booking ? booking.paid || sisa === 0 : false;

  const handleBayar = async () => {
    if (sisa <= 0) return;
    setSaving(true);
    setPesan(null);
    try {
      const catatanBayar =
        bayar.metode === "transfer_bank" ? `Transfer ${bayar.bank} - ${bayar.catatan}`.trim() : bayar.catatan.trim();
      await createTransaction({
        bookingId: booking.id,
        metode: bayar.metode,
        jumlah: sisa,
        catatan: catatanBayar || undefined,
      });
      setPesan({ tipe: "sukses", teks: `Pembayaran ${formatRupiah(sisa)} tercatat.` });
      setShowBayar(false);
      fetchData();
    } catch (err) {
      setPesan({ tipe: "error", teks: pesanError(err) });
    } finally {
      setSaving(false);
    }
  };

  // Untuk warna hijau/merah di Ringkasan Biaya: anggap layanan dibayar berurutan.
  // unit tercover penuh -> hijau, belum -> merah, sebagian -> hijau sebagian (tampilkan sisa).
  const paidPerUnit = (() => {
    let remainingPaid = totalDibayar;
    return (booking?.items || []).map((u) => {
      const harga = Number(u.harga || 0);
      const covered = Math.min(harga, remainingPaid);
      remainingPaid -= covered;
      return { harga, covered, belum: Math.max(0, harga - covered), lunas: covered >= harga };
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
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>
        <button onClick={() => navigate("/booking")} className="text-sm text-primary hover:underline">
          ← Kembali ke Daftar Booking
        </button>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <>
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
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
        <div className="ml-auto flex items-center gap-2">
          {sisa > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Kurang {formatRupiah(sisa)}</span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor[booking.status] || "bg-gray-100 text-gray-700"}`}>
            {booking.status}
          </span>
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
                <p className="text-base font-bold text-primary">{booking.pelanggan}</p>
                <p className="text-sm text-slate-700">
                  WhatsApp: <strong>{booking.telepon}</strong>
                </p>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span>
                  {booking.labelAlamat && (
                    <span className="mr-1 rounded bg-soft px-1.5 py-0.5 text-xs font-bold text-primary">{booking.labelAlamat}</span>
                  )}
                  {booking.alamat}
                </span>
              </p>
              {booking.catatanLokasi && <p className="mt-1 pl-6 text-xs text-slate-400">Patokan: {booking.catatanLokasi}</p>}
              {booking.catatan && <p className="mt-2 text-xs italic text-slate-500">Catatan booking: {booking.catatan}</p>}
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
                          Unit #{i + 1} {paidPerUnit[i]?.lunas ? "(Lunas)" : sisa === 0 ? "(Lunas)" : "(Belum)"}
                        </span>
                        {u.layanan}
                      </p>
                      <p className="shrink-0 text-xs font-bold text-slate-900">{formatRupiah(u.harga)}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {u.merek} {u.kapasitas} ({u.tipe}) • Lokasi: {u.unit}
                    </p>
                    {u.catatan && <p className="mt-1 text-xs italic text-slate-400">Keluhan: {u.catatan}</p>}
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
                <p className="text-base font-bold text-primary">{booking.jadwal} WIB</p>
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

          {/* KANAN: Detail Pembayaran + Ringkasan Biaya (sticky) */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-xl border border-secondary/30 bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-secondary">
                  <CreditCard size={18} />
                </span>
                Detail Pembayaran
              </h2>
              <div
                className={`mb-4 rounded-lg p-3 ${isPaid ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Sisa Tagihan Belum Dibayar</p>
                <p className={`text-2xl font-bold ${isPaid ? "text-green-700" : "text-red-600"}`}>{isPaid ? "LUNAS" : formatRupiah(sisa)}</p>
                {!isPaid && (
                  <p className="mt-1 text-xs text-slate-500">
                    Total {formatRupiah(booking.total)} • Sudah dibayar {formatRupiah(totalDibayar)}
                  </p>
                )}
              </div>

              {booking.transaksi.length > 0 && (
                <div className="mb-4 space-y-2">
                  {booking.transaksi.map((t) => (
                    <div key={t.id} className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <p className="flex items-center gap-2 text-sm font-bold text-green-700">
                        <CheckCircle2 size={16} /> {formatRupiah(t.jumlah)}
                      </p>
                      <div className="mt-1 space-y-1 text-xs text-slate-600">
                        <p>
                          Metode: <strong className="text-slate-900">{METODE[t.metode] || t.metode}</strong> • Invoice{" "}
                          <strong className="font-mono text-slate-900">{t.invoice}</strong>
                        </p>
                        {t.tanggal && (
                          <p>Tanggal: {new Date(t.tanggal).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>
                        )}
                      </div>
                      {t.catatan && <p className="mt-2 border-t border-green-200 pt-2 text-xs italic text-slate-500">Catatan: {t.catatan}</p>}
                    </div>
                  ))}
                </div>
              )}

              {!isPaid ? (
                <div>
                  {!showBayar ? (
                    <button
                      type="button"
                      onClick={() => setShowBayar(true)}
                      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary"
                    >
                      Bayar {formatRupiah(sisa)}
                    </button>
                  ) : (
                    <div className="space-y-3 rounded-lg border border-soft bg-soft/20 p-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">Metode Pembayaran</label>
                        <select
                          value={bayar.metode}
                          onChange={(e) => setBayar({ ...bayar, metode: e.target.value })}
                          className="w-full rounded-lg border border-soft bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
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
                          <label className="mb-1 block text-xs font-bold text-slate-700">Bank Tujuan</label>
                          <select
                            value={bayar.bank}
                            onChange={(e) => setBayar({ ...bayar, bank: e.target.value })}
                            className="w-full rounded-lg border border-soft bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
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
                        <label className="mb-1 block text-xs font-bold text-slate-700">Catatan (opsional)</label>
                        <input
                          type="text"
                          placeholder={bayar.metode === "transfer_bank" ? "No. referensi / keterangan" : "Catatan pembayaran"}
                          value={bayar.catatan}
                          onChange={(e) => setBayar({ ...bayar, catatan: e.target.value })}
                          className="w-full rounded-lg border border-soft bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleBayar}
                          disabled={saving}
                          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
                        >
                          {saving ? "Menyimpan..." : `Simpan Lunas ${formatRupiah(sisa)}`}
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
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <AlertCircle size={14} /> Menyetor sebesar sisa tagihan menambah saldo lunas.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-soft/40 px-3 py-2 text-xs text-slate-500">
                  <Wallet size={14} /> Tagihan sudah lunas — tidak perlu bayar lagi.
                </div>
              )}
            </div>

            {/* Ringkasan Biaya: hijau = sudah dibayar, merah = belum dibayar, total = sisa */}
            <div className="rounded-xl border border-soft bg-white p-5 shadow">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <Receipt size={18} className="text-secondary" /> Ringkasan Biaya
              </h2>

              {isPaid && booking.status === "Selesai" && (
                <div className="mb-4 rounded-lg border border-secondary/30 bg-soft/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold uppercase text-primary">Invoice Resmi</p>
                      <p className="font-mono text-xs text-slate-600">No: INV/{booking.kode}</p>
                    </div>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">LUNAS & SELESAI</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const printWindow = window.open("", "_blank");
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Invoice - ${booking.kode}</title>
                            <style>
                              body { font-family: sans-serif; padding: 24px; color: #333; }
                              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ddd; padding-bottom: 12px; margin-bottom: 16px; }
                              .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
                              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                              th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
                              th { background: #f3f4f6; }
                              .text-right { text-align: right; }
                              .footer { margin-top: 24px; text-align: right; font-weight: bold; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div>
                                <div class="title">INVOICE SERVIS AC</div>
                                <div style="font-size: 12px; color: #666; font-family: monospace;">No. Reg: ${booking.kode}</div>
                              </div>
                              <div style="text-align: right; font-size: 12px;">
                                <div>Tanggal: ${booking.tanggal}</div>
                                <div>Status: <strong>LUNAS & SELESAI</strong></div>
                              </div>
                            </div>
                            <div style="margin-bottom: 16px; font-size: 13px;">
                              <strong>Kepada:</strong> ${booking.pelanggan} (${booking.telepon})<br/>
                              <strong>Alamat:</strong> ${booking.alamat}
                            </div>
                            <table>
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Layanan & Unit</th>
                                  <th>Detail AC</th>
                                  <th class="text-right">Harga</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${booking.items.map((u, i) => `
                                  <tr>
                                    <td>${i + 1}</td>
                                    <td><strong>${u.layanan}</strong></td>
                                    <td>${u.merek} ${u.kapasitas} (${u.tipe}) - Lokasi: ${u.unit}</td>
                                    <td class="text-right">${formatRupiah(u.harga)}</td>
                                  </tr>
                                `).join("")}
                              </tbody>
                            </table>
                            <div class="footer">
                              <div>Total Tagihan: ${formatRupiah(booking.total)}</div>
                              <div style="color: #16a34a;">Status Pembayaran: LUNAS</div>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-secondary"
                  >
                    <Printer size={14} /> Cetak Invoice (No. Reg: {booking.kode})
                  </button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {booking.items.map((u, i) => {
                  const info = paidPerUnit[i];
                  const isGreen = info.lunas;
                  return (
                    <div
                      key={u.id}
                      className={`flex justify-between gap-2 rounded-lg border px-3 py-2 ${isGreen ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${isGreen ? "bg-green-500" : "bg-red-500"}`} />
                        {u.layanan} (#{i + 1})
                      </span>
                      <span className="shrink-0 font-bold">{formatRupiah(u.harga)}</span>
                    </div>
                  );
                })}
                {booking.items.length === 0 && <p className="text-xs text-slate-400">Tidak ada layanan.</p>}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-medium">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Sudah dibayar
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Belum dibayar
                </span>
              </div>
              <div className="mt-3 border-t border-soft pt-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Total tagihan</span>
                  <span className="font-bold text-slate-900">{formatRupiah(booking.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Sudah dibayar</span>
                  <span className="font-bold text-green-700">{formatRupiah(totalDibayar)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Sisa Tagihan Belum Dibayar</span>
                  <p className={`text-2xl font-bold ${isPaid ? "text-green-700" : "text-red-600"}`}>
                    {isPaid ? "LUNAS (Rp 0)" : formatRupiah(sisa)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
