// src/components/home/CekStatusBooking.jsx
// Langkah 4: cek status servis dengan nomor registrasi dan nomor HP pemesan
import { useState } from "react";
import { Search, CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react";
import { cekStatusBooking } from "../../services/publicService";
import { formatRupiah } from "../../utils/booking";

const TAHAP = ["Menunggu", "Dikonfirmasi", "Selesai"];

const KETERANGAN = {
  Menunggu:
    "Booking Anda sudah kami terima dan sedang menunggu konfirmasi admin.",
  Dikonfirmasi: "Jadwal sudah dikonfirmasi. Teknisi akan datang sesuai jadwal.",
  Selesai: "Servis sudah selesai. Terima kasih telah memilih SejukPro.",
  Dibatalkan: "Booking ini dibatalkan. Hubungi kami jika ada pertanyaan.",
};

export default function CekStatusBooking() {
  const [kode, setKode] = useState("");
  const [telepon, setTelepon] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [pesan, setPesan] = useState("");

  const handleCek = async (ev) => {
    ev.preventDefault();

    // Langkah 4.1: validasi sebelum menghubungi server
    const kodeBersih = kode.trim().toUpperCase();
    const teleponBersih = telepon.replace(/[\s-]/g, "");
    const e = {};
    if (!/^BK-\d{8}-\d{4}$/.test(kodeBersih))
      e.kode = "Format kode seperti BK-20261008-3176";
    if (!/^\d{10,15}$/.test(teleponBersih))
      e.telepon = "No. HP harus 10-15 digit angka";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setHasil(null);
    setPesan("");
    setHasSearched(true);
    try {
      setHasil(
        await cekStatusBooking({ kode: kodeBersih, telepon: teleponBersih }),
      );
    } catch (err) {
      if (err instanceof TypeError) {
        setPesan(
          "Tidak dapat terhubung ke server. Coba lagi beberapa saat lagi.",
        );
      } else if (String(err.message).startsWith("Alamat API")) {
        // endpoint belum tersedia di backend
        setPesan("Layanan cek status belum tersedia saat ini.");
      } else if (err.status === 404) {
        setPesan(
          "Booking tidak ditemukan. Periksa kembali kode dan nomor HP yang Anda masukkan.",
        );
      } else {
        setPesan(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-accent/40 ${
      error ? "border-red-500" : "border-soft"
    }`;

  const indeks = hasil ? TAHAP.indexOf(hasil.status) : -1;
  const dibatalkan = hasil?.status === "Dibatalkan";

  return (
    <div className="rounded-xl border border-soft bg-white p-6 shadow-sm">
      <form
        onSubmit={handleCek}
        noValidate
        className="grid grid-cols-1 gap-3 md:grid-cols-12"
      >
        <div className="md:col-span-5">
          <label
            htmlFor="kodeStatus"
            className="mb-1 block text-xs font-bold text-slate-800"
          >
            Nomor Registrasi
          </label>
          <input
            id="kodeStatus"
            value={kode}
            onChange={(e) => {
              setKode(e.target.value);
              setErrors({ ...errors, kode: "" });
            }}
            placeholder="BK-20261008-3176"
            className={`${inputClass(errors.kode)} font-mono uppercase`}
          />
          {errors.kode && (
            <p className="mt-1 text-xs text-red-600">{errors.kode}</p>
          )}
        </div>

        <div className="md:col-span-4">
          <label
            htmlFor="teleponStatus"
            className="mb-1 block text-xs font-bold text-slate-800"
          >
            No. HP Pemesan
          </label>
          <input
            id="teleponStatus"
            type="tel"
            value={telepon}
            onChange={(e) => {
              setTelepon(e.target.value);
              setErrors({ ...errors, telepon: "" });
            }}
            placeholder="081234567890"
            className={inputClass(errors.telepon)}
          />
          {errors.telepon && (
            <p className="mt-1 text-xs text-red-600">{errors.telepon}</p>
          )}
        </div>

        <div className="flex items-end md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            {loading ? "Mencari..." : "Cek Status"}
          </button>
        </div>
      </form>

      {pesan && (
        <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {pesan}
        </p>
      )}

      {/* Langkah 4.2: hasil, hanya data yang aman ditampilkan ke pelanggan */}
      {hasil ? (
        <div className="mt-5 space-y-4 border-t border-soft pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm font-bold text-primary">
              {hasil.kode}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                dibatalkan
                  ? "bg-red-100 text-red-700"
                  : hasil.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : hasil.status === "Dikonfirmasi"
                      ? "bg-soft text-primary"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {hasil.status}
            </span>
          </div>

          {dibatalkan ? (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <XCircle size={18} /> {KETERANGAN.Dibatalkan}
            </p>
          ) : (
            <ol className="flex items-center gap-2">
              {TAHAP.map((t, i) => {
                const sudah = i <= indeks;
                return (
                  <li key={t} className="flex flex-1 items-center gap-2">
                    {sudah ? (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-secondary"
                      />
                    ) : (
                      <Circle size={20} className="shrink-0 text-slate-300" />
                    )}
                    <span
                      className={`text-xs ${sudah ? "font-bold text-slate-900" : "text-slate-400"}`}
                    >
                      {t}
                    </span>
                    {i < TAHAP.length - 1 && (
                      <span className="h-px flex-1 bg-soft" />
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {!dibatalkan && (
            <p className="text-sm text-slate-600">{KETERANGAN[hasil.status]}</p>
          )}

          <div className="rounded-lg bg-soft/30 p-4 text-sm">
            <p className="font-bold text-slate-900">
              Jadwal: {hasil.jadwal} WIB
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {hasil.items.map((it, i) => (
                <li key={it.id ?? i}>
                  {it.layanan || "Layanan"}
                  {it.unit ? (
                    <span className="text-slate-400"> ({it.unit})</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-soft pt-2 text-xs">
              <span>Total tagihan</span>
              <span className="font-bold text-slate-900">
                {formatRupiah(hasil.total)}
              </span>
            </p>
            <p className="mt-1 flex justify-between text-xs">
              <span>Pembayaran</span>
              <span
                className={`font-bold ${hasil.lunas ? "text-green-700" : "text-red-600"}`}
              >
                {hasil.lunas ? "Lunas" : "Belum lunas"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center py-10 text-center text-slate-400">
          {loading ? (
            <Loader2 size={32} className="mb-3 animate-spin text-primary" />
          ) : (
            <>
              <Search size={40} className="mb-3 opacity-20" />
              <p className="text-xs">
                {hasSearched
                  ? "Booking tidak ditemukan. Periksa kembali nomor registrasi dan nomor HP Anda."
                  : "Masukkan nomor registrasi dan nomor HP untuk melihat status booking Anda."}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}