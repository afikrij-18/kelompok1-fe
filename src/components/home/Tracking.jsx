// src/components/home/Tracking.jsx
// Langkah 5: cek status service terhubung ke data booking di admin
import { useState } from "react";
import {
  Search,
  Phone,
  TextSearch,
  TicketCheck,
  Info,
  XCircle,
  Loader2,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import StatusItem from "../ui/StatusItem";
import { cekStatusBooking } from "../../services/publicService";
import { formatRupiah } from "../../utils/booking";

// Langkah 5.1: tahap status yang bisa dipastikan dari data booking
const TAHAP = [
  {
    judul: "Booking Diterima",
    deskripsi:
      "Pesanan Anda sudah masuk ke sistem dan menunggu konfirmasi admin.",
  },
  {
    judul: "Booking Dikonfirmasi",
    deskripsi: "Jadwal sudah dikonfirmasi, teknisi akan datang sesuai jadwal.",
  },
  {
    judul: "Service Selesai",
    deskripsi: "Pekerjaan rampung. Terima kasih telah memilih SejukPro.",
  },
];
const INDEKS = { Menunggu: 0, Dikonfirmasi: 1, Selesai: 2 };

const BADGE = {
  Menunggu: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Dikonfirmasi: "bg-[#e8f5ff] text-[#2c5ead] border-[#c4e2f5]",
  Selesai: "bg-green-100 text-green-700 border-green-200",
  Dibatalkan: "bg-red-100 text-red-700 border-red-200",
};

export default function Tracking() {
  const [registration, setRegistration] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [message, setMessage] = useState("");

  // Langkah 5.2: validasi dulu, lalu cek ke server
  const handleCheckStatus = async (event) => {
    event.preventDefault();

    const kode = registration.trim().toUpperCase();
    const telepon = phone.replace(/[\s-]/g, "");
    const e = {};
    if (!/^BK-\d{8}-\d{4}$/.test(kode))
      e.registration = "Format kode seperti BK-20261008-3176";
    if (!/^\d{10,15}$/.test(telepon))
      e.phone = "No. HP harus 10-15 digit angka";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setHasil(null);
    setMessage("");
    try {
      setHasil(await cekStatusBooking({ kode, telepon }));
    } catch (err) {
      if (err instanceof TypeError) {
        setMessage(
          "Tidak dapat terhubung ke server. Coba lagi beberapa saat lagi.",
        );
      } else if (String(err.message).startsWith("Alamat API")) {
        // endpoint belum dibuat di backend
        setMessage("Layanan cek status belum tersedia saat ini.");
      } else if (err.status === 404) {
        // pesan sama untuk kode salah maupun nomor HP salah
        setMessage(
          "Booking tidak ditemukan. Periksa kembali nomor registrasi dan nomor HP yang Anda masukkan.",
        );
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (error, mono = false) =>
    `w-full rounded-xl border py-3 pl-10 pr-4 text-xs text-[#0a2540] outline-none transition-all placeholder:text-slate-400 focus:border-[#2c5ead] focus:ring-2 focus:ring-[#2c5ead]/20 sm:text-sm ${
      mono ? "font-mono" : ""
    } ${error ? "border-red-500" : "border-[#c4e2f5]"}`;

  const dibatalkan = hasil?.status === "Dibatalkan";
  const indeks = hasil ? (INDEKS[hasil.status] ?? 0) : 0;

  return (
    <section
      id="cek-status"
      className="border-t border-[#c4e2f5] bg-[#f5faff] py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="SUDAH MELAKUKAN BOOKING?"
          description="Pantau status service AC Anda menggunakan nomor registrasi dan nomor HP."
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* FORM CEK STATUS */}
          <div className="rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ff] text-[#2c5ead]">
                <TextSearch size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#0a2540]">
                  Cek Status Service
                </h3>
                <p className="text-xs text-[#434751]">
                  Masukkan nomor registrasi dan nomor HP pemesan
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckStatus} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="trackReg"
                  className="mb-1.5 block text-xs font-bold text-[#0a2540]"
                >
                  Nomor Registrasi
                </label>

                <div className="relative">
                  <TicketCheck
                    size={18}
                    className="absolute left-3.5 top-3 text-[#434751]"
                  />
                  <input
                    id="trackReg"
                    value={registration}
                    onChange={(event) => {
                      setRegistration(event.target.value.toUpperCase());
                      setErrors({ ...errors, registration: "" });
                    }}
                    placeholder="Contoh: BK-20261008-3176"
                    type="text"
                    className={inputClass(errors.registration, true)}
                  />
                </div>
                {errors.registration && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.registration}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trackPhone"
                  className="mb-1.5 block text-xs font-bold text-[#0a2540]"
                >
                  No. HP / WhatsApp
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-3 text-[#434751]"
                  />
                  <input
                    id="trackPhone"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="Masukkan nomor HP"
                    type="tel"
                    className={inputClass(errors.phone)}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2c5ead] py-3.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#1f4684] disabled:opacity-60 sm:text-sm"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                {loading ? "MENCARI..." : "CEK STATUS SERVICE"}
              </button>
            </form>

            {message && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {message}
              </div>
            )}

            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#434751]">
              <Info size={15} className="shrink-0 text-[#1591dc]" />
              Nomor registrasi dapat ditemukan setelah booking berhasil.
            </p>
          </div>

          {/* STATUS SERVICE */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            {hasil ? (
              <>
                {/* Langkah 5.3: status asli dari data booking */}
                <div className="flex items-center justify-between border-b border-[#c4e2f5] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1591dc]">
                      Status service Anda
                    </span>
                    <h3 className="mt-0.5 font-mono text-base font-bold text-[#0a2540] sm:text-lg">
                      BOOKING #{hasil.kode}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      BADGE[hasil.status] || BADGE.Menunggu
                    }`}
                  >
                    {hasil.status}
                  </span>
                </div>

                {dibatalkan ? (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <XCircle size={20} className="mt-0.5 shrink-0" />
                    <p>
                      Booking ini dibatalkan. Hubungi kami jika Anda memerlukan
                      bantuan atau ingin menjadwalkan ulang.
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="relative flex flex-col space-y-6">
                      {TAHAP.map((t, j) => (
                        <StatusItem
                          key={t.judul}
                          completed={j < indeks || indeks === TAHAP.length - 1}
                          current={j === indeks && indeks < TAHAP.length - 1}
                          last={j === TAHAP.length - 1}
                          title={t.judul}
                          description={
                            j === 1 && hasil.teknisi
                              ? `Jadwal sudah dikonfirmasi. Teknisi ${hasil.teknisi} akan datang sesuai jadwal.`
                              : t.deskripsi
                          }
                          extra={
                            j === indeks && indeks < TAHAP.length - 1
                              ? `${hasil.jadwal} WIB`
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Langkah 5.4: rincian yang aman untuk pelanggan, tanpa alamat dan nomor HP */}
                <div className="rounded-xl border border-[#c4e2f5] bg-[#f5faff] p-4 text-sm">
                  <p className="font-bold text-[#0a2540]">
                    Jadwal: {hasil.jadwal} WIB
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-[#434751]">
                    {hasil.items.map((it, i) => (
                      <li key={it.id ?? i}>
                        {it.layanan || "Layanan"}
                        {it.unit ? (
                          <span className="text-slate-400"> ({it.unit})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-[#c4e2f5] pt-2 text-xs">
                    <span>Total tagihan</span>
                    <span className="font-bold text-[#0a2540]">
                      {formatRupiah(hasil.total)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span>Pembayaran</span>
                    <span
                      className={`font-bold ${hasil.lunas ? "text-green-700" : "text-red-600"}`}
                    >
                      {hasil.lunas ? "Lunas" : "Belum lunas"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* contoh tampilan, tetap tampil sampai ada hasil pencarian */}
                <div className="flex items-center justify-between border-b border-[#c4e2f5] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1591dc]">
                      Contoh status service
                    </span>

                    <h3 className="mt-0.5 font-mono text-base font-bold text-[#0a2540] sm:text-lg">
                      BOOKING #BK-20261008-3176
                    </h3>
                  </div>

                  <span className="rounded-full border border-[#c4e2f5] bg-[#e8f5ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2c5ead]">
                    Demo
                  </span>
                </div>

                <div className="py-2">
                  <div className="relative flex flex-col space-y-6">
                    <StatusItem
                      completed
                      title="Booking Dikonfirmasi"
                      description="Pesanan Anda telah diterima dalam sistem jadwal."
                    />

                    <StatusItem
                      completed
                      title="Teknisi Ditugaskan"
                      description="Teknisi siap bertugas sesuai jadwal Anda."
                    />

                    <StatusItem
                      current
                      title="Teknisi Dalam Perjalanan"
                      description="Teknisi sedang meluncur ke alamat service Anda."
                      extra="Estimasi tiba: 14:15 WIB"
                    />

                    <StatusItem
                      title="Sedang Dikerjakan"
                      description="Proses pencucian dan pemeriksaan teknis unit AC."
                    />

                    <StatusItem
                      last
                      title="Service Selesai"
                      description="Pekerjaan rampung dan kartu garansi aktif."
                    />
                  </div>
                </div>

                <p className="text-center text-[11px] text-[#434751]">
                  Masukkan nomor registrasi dan nomor HP untuk melihat status
                  booking Anda yang sebenarnya.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}