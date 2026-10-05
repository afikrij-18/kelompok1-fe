import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle,
  Checklist,
  CircleCheck,
  Clock3,
  Construction,
  Droplets,
  Hammer,
  Handyman,
  Info,
  Laptop,
  Mail,
  ManageSearch,
  MapPin,
  Move,
  Navigation,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Snowflake,
  Speedometer,
  TicketCheck,
  TrackChanges,
  UserCheck,
  Wrench,
} from "lucide-react";

const logo =
  "https://lh3.googleusercontent.com/aida/AEtjO1XI7KRXxhDBtDa80FkU8Tb-pFio6rOck3KT07iAXnCDtueAXHVbFXywjV9t2M2uXE9r_DsaAVOM55Us28BWj3moq85zXnQW9rmGx5wzASMRdtOcxbHFJAlVhIrCYdwIJR6hw74WRqwsuWs2ifnlQHBguhoXseVpPjTFFRfgBmfcJC6XkhoEzh1UxWzJirkjjc7PA9PkZY1VKuuBA55pULVmbq8ZXwsO1fz1ITJZwKbSD2e-3DIAwLJ223c";

const heroImage = "";

const services = [
  {
    title: "Cuci AC",
    description: "Membersihkan AC agar tetap bersih dan bekerja optimal.",
    icon: Droplets,
    color: "primary",
  },
  {
    title: "Service AC",
    description: "Perawatan dan pemeriksaan kondisi AC.",
    icon: Wrench,
    color: "secondary",
  },
  {
    title: "Isi Freon",
    description: "Pengisian refrigeran sesuai kebutuhan unit AC.",
    icon: Speedometer,
    color: "primary",
  },
  {
    title: "Perbaikan AC",
    description: "Penanganan berbagai masalah dan kerusakan AC.",
    icon: Hammer,
    color: "secondary",
  },
  {
    title: "Bongkar AC",
    description: "Jasa pembongkaran unit AC dengan aman.",
    icon: Move,
    color: "primary",
  },
  {
    title: "Pasang AC",
    description: "Jasa pemasangan unit AC secara profesional.",
    icon: Handyman,
    color: "secondary",
  },
];

const benefits = [
  {
    title: "Teknisi Profesional",
    description: "Ditangani oleh teknisi yang berpengalaman.",
    icon: ShieldCheck,
    color: "primary",
  },
  {
    title: "Jadwal Fleksibel",
    description: "Pilih tanggal dan waktu service sesuai ketersediaan.",
    icon: CalendarCheck,
    color: "secondary",
  },
  {
    title: "Booking Online",
    description: "Pesan layanan tanpa harus datang langsung.",
    icon: Laptop,
    color: "primary",
  },
  {
    title: "Pantau Status Service",
    description: "Cek progres service menggunakan nomor registrasi.",
    icon: TrackChanges,
    color: "secondary",
  },
];

const bookingSteps = [
  {
    number: "01",
    title: "Data Pelanggan",
    description: "Masukkan nama, nomor HP/WhatsApp, dan alamat service.",
  },
  {
    number: "02",
    title: "Unit AC",
    description: "Tambahkan satu atau beberapa unit AC yang ingin diservice.",
    highlight: true,
  },
  {
    number: "03",
    title: "Pilih Jadwal",
    description: "Pilih tanggal dan waktu service yang tersedia.",
  },
  {
    number: "04",
    title: "Review & Konfirmasi",
    description: "Periksa kembali data booking sebelum dikonfirmasi.",
  },
  {
    number: "05",
    title: "Nomor Registrasi",
    description: "Dapatkan nomor registrasi untuk memantau status service.",
  },
];

function AppIcon({ icon: Icon, className = "" }) {
  return <Icon className={className} strokeWidth={2} />;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
  });
}

export default function Home() {
  const [registration, setRegistration] = useState("AC-2026-00128");
  const [phone, setPhone] = useState("");
  const [tracking, setTracking] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckStatus = (e) => {
    e.preventDefault();

    if (!registration.trim()) {
      setMessage("Silakan masukkan nomor registrasi.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Silakan masukkan nomor HP / WhatsApp.");
      return;
    }

    setTracking(true);
    setMessage(
      `Status booking ${registration.toUpperCase()} berhasil ditemukan.`,
    );
  };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#0d1b2a] antialiased">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-[#c4e2f5] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="SejukPro Logo"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </button>

          <nav className="hidden items-center gap-1 md:flex lg:gap-2">
            <a
              href="#hero"
              className="rounded-lg bg-[#e8f5ff] px-3.5 py-2 text-xs font-bold text-[#2c5ead] transition-colors hover:text-[#0a2540]"
            >
              Beranda
            </a>

            <a
              href="#layanan"
              className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
            >
              Layanan
            </a>

            <a
              href="#cara-booking"
              className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
            >
              Cara Booking
            </a>

            <a
              href="#cek-status"
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
            >
              <TrackChanges size={16} className="text-[#1591dc]" />
              Cek Status
            </a>
          </nav>

          <a
            href="#cara-booking"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2c5ead] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#2c5ead]/25 transition-all hover:-translate-y-0.5 hover:bg-[#1f4684] sm:px-5 sm:text-sm"
          >
            <Calendar size={18} />
            <span>Booking Service</span>
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#c4e2f5] bg-gradient-to-b from-[#e8f5ff] via-[#f5faff] to-white pb-16 pt-8 md:pb-24 md:pt-14"
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1591dc]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-[#4bb8fa]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="flex flex-col items-start space-y-6 lg:col-span-7">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#0a2540] sm:text-4xl lg:text-5xl">
                AC Bermasalah?
                <br />
                <span className="bg-linear-to-r from-[#2c5ead] to-[#1591dc] bg-clip-text text-transparent">
                  Kami Siap Membantu.
                </span>
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-[#1e293b] sm:text-base">
                Cuci, service, perbaikan, dan perawatan AC dengan teknisi
                profesional. Booking service AC dengan mudah secara online.
              </p>

              <div className="flex w-full flex-wrap items-center gap-5 pt-2 sm:w-auto">
                <a
                  href="#cara-booking"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2c5ead] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2c5ead]/30 transition-all hover:-translate-y-0.5 hover:bg-[#1f4684] sm:w-auto"
                >
                  <CalendarCheck size={21} />
                  BOOKING SERVICE
                </a>

                <a
                  href="#cek-status"
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#1591dc] transition-colors hover:text-[#2c5ead] sm:text-sm"
                >
                  Sudah booking? Cek status service
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 border-t border-[#c4e2f5] pt-4 sm:grid-cols-3">
                {[
                  "Booking online dengan mudah",
                  "Bisa untuk beberapa unit AC",
                  "Dapatkan nomor registrasi & pantau status",
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 rounded-xl border border-[#c4e2f5] bg-white p-3 shadow-sm"
                  >
                    <CheckCircle
                      size={20}
                      className={
                        index === 1
                          ? "shrink-0 text-[#1591dc]"
                          : "shrink-0 text-[#2c5ead]"
                      }
                    />
                    <span className="text-xs font-bold text-[#0d1b2a]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md">
                <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-2xl">
                  <img
                    src={heroImage}
                    alt="Teknisi AC SejukPro profesional sedang menservis AC"
                    className="h-[450px] w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAYANAN ================= */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0a2540] sm:text-3xl lg:text-4xl">
              LAYANAN KAMI
            </h2>

            <p className="mt-2 text-xs text-[#1e293b] sm:text-sm">
              Solusi service AC untuk kebutuhan rumah, kantor, dan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isPrimary = service.color === "primary";

              return (
                <div
                  key={service.title}
                  className="group flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-6 shadow-sm transition-all hover:border-[#1591dc] hover:shadow-lg"
                >
                  <div>
                    <div
                      className={`mb-4 flex w-fit items-center justify-center rounded-2xl p-3 shadow-sm transition-colors ${
                        isPrimary
                          ? "bg-[#e8f5ff] text-[#2c5ead] group-hover:bg-[#2c5ead]"
                          : "bg-[#e8f5ff] text-[#1591dc] group-hover:bg-[#1591dc]"
                      } group-hover:text-white`}
                    >
                      <Icon size={30} />
                    </div>

                    <h3 className="text-base font-bold text-[#0a2540] transition-colors group-hover:text-[#2c5ead] sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#434751] sm:text-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#c4e2f5] pt-4">
                    <a
                      href="#cara-booking"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2c5ead] transition-colors hover:text-[#1591dc]"
                    >
                      Pilih Layanan
                      <ArrowRight size={15} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= KENAPA KAMI ================= */}
      <section
        id="kenapa-kami"
        className="border-y border-[#c4e2f5] bg-[#f5faff] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0a2540] sm:text-3xl lg:text-4xl">
              KENAPA MEMILIH KAMI?
            </h2>

            <p className="mt-2 text-xs text-[#1e293b] sm:text-sm">
              Service AC lebih mudah, terjadwal, dan transparan tanpa rasa
              was-was.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              const isPrimary = benefit.color === "primary";

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                      isPrimary
                        ? "bg-[#e8f5ff] text-[#2c5ead]"
                        : "bg-[#e8f5ff] text-[#1591dc]"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-sm font-bold text-[#0a2540] sm:text-base">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#434751]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CARA BOOKING ================= */}
      <section id="cara-booking" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0a2540] sm:text-3xl lg:text-4xl">
              CARA BOOKING SERVICE
            </h2>

            <p className="mt-2 text-xs text-[#1e293b] sm:text-sm">
              Booking service AC dengan mudah dalam beberapa langkah.
            </p>
          </div>

          <div className="relative mb-12 grid grid-cols-1 gap-4 md:grid-cols-5">
            {bookingSteps.map((step) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center rounded-2xl p-5 text-center transition-colors ${
                  step.highlight
                    ? "border-2 border-[#2c5ead] bg-[#e8f5ff] shadow-md"
                    : "border border-[#c4e2f5] bg-[#f5faff] hover:border-[#1591dc]"
                }`}
              >
                {step.highlight && (
                  <span className="absolute -top-3 rounded-full bg-[#2c5ead] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                    Fitur Utama: Bisa Multi-Unit
                  </span>
                )}

                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                    step.highlight
                      ? "mt-1 bg-[#1591dc]"
                      : step.number === "05"
                        ? "bg-[#0a2540]"
                        : step.number === "04"
                          ? "bg-[#1591dc]"
                          : "bg-[#2c5ead]"
                  }`}
                >
                  {step.number}
                </div>

                <h3 className="text-xs font-bold text-[#0a2540] sm:text-sm">
                  {step.title}
                </h3>

                <p className="mt-1.5 text-[11px] leading-relaxed text-[#434751] sm:text-xs">
                  {step.description}
                </p>

                {step.highlight && (
                  <span className="mt-2 block border-t border-[#c4e2f5] pt-2 text-[10px] font-semibold text-[#1591dc]">
                    Beberapa unit AC di satu lokasi dapat dimasukkan dalam satu
                    booking.
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => scrollToSection("hero")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c5ead] px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#2c5ead]/25 transition-all hover:-translate-y-0.5 hover:bg-[#1f4684] sm:text-sm"
            >
              BOOKING SERVICE SEKARANG
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= CEK STATUS ================= */}
      <section
        id="cek-status"
        className="border-y border-[#c4e2f5] bg-[#f5faff] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0a2540] sm:text-3xl lg:text-4xl">
              SUDAH MELAKUKAN BOOKING?
            </h2>

            <p className="mt-2 text-xs text-[#1e293b] sm:text-sm">
              Pantau status service AC Anda menggunakan nomor registrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* FORM */}
            <div className="rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ff] text-[#2c5ead]">
                  <ManageSearch size={24} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0a2540]">
                    Cek Status Service
                  </h3>
                  <p className="text-xs text-[#434751]">
                    Masukkan nomor registrasi pesanan
                  </p>
                </div>
              </div>

              <form onSubmit={handleCheckStatus} className="space-y-4">
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
                      onChange={(e) =>
                        setRegistration(e.target.value.toUpperCase())
                      }
                      placeholder="Contoh: AC-2026-00128"
                      type="text"
                      className="w-full rounded-xl border border-[#c4e2f5] py-3 pl-10 pr-4 font-mono text-xs text-[#0a2540] outline-none transition-all placeholder:text-slate-400 focus:border-[#2c5ead] focus:ring-2 focus:ring-[#2c5ead]/20 sm:text-sm"
                    />
                  </div>
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
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Masukkan nomor HP"
                      type="tel"
                      className="w-full rounded-xl border border-[#c4e2f5] py-3 pl-10 pr-4 text-xs text-[#0a2540] outline-none transition-all placeholder:text-slate-400 focus:border-[#2c5ead] focus:ring-2 focus:ring-[#2c5ead]/20 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2c5ead] py-3.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#1f4684] sm:text-sm"
                >
                  <Search size={18} />
                  CEK STATUS SERVICE
                </button>
              </form>

              {message && (
                <div className="mt-4 rounded-xl border border-[#c4e2f5] bg-[#e8f5ff] p-3 text-xs font-semibold text-[#2c5ead]">
                  {message}
                </div>
              )}

              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#434751]">
                <Info size={15} className="shrink-0 text-[#1591dc]" />
                Nomor registrasi dapat ditemukan setelah booking berhasil.
              </p>
            </div>

            {/* STATUS PREVIEW */}
            <div className="flex flex-col gap-6 rounded-2xl border border-[#c4e2f5] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
              <div className="flex items-center justify-between border-b border-[#c4e2f5] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1591dc]">
                    Contoh status service
                  </span>

                  <h3 className="mt-0.5 text-base font-bold text-[#0a2540] sm:text-lg">
                    BOOKING #{registration || "AC-2026-00128"}
                  </h3>
                </div>

                <span className="rounded-full border border-[#c4e2f5] bg-[#e8f5ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2c5ead]">
                  Demo
                </span>
              </div>

              <div className="py-2">
                <div className="relative flex flex-col space-y-6">
                  {/* STATUS 1 */}
                  <StatusItem
                    active
                    completed
                    title="Booking Dikonfirmasi"
                    description="Pesanan Anda telah diterima dalam sistem jadwal."
                  />

                  {/* STATUS 2 */}
                  <StatusItem
                    active
                    completed
                    title="Teknisi Ditugaskan"
                    description="Teknisi Bpk. Rahmat Santoso siap bertugas."
                  />

                  {/* STATUS 3 */}
                  <StatusItem
                    active
                    current
                    title="Teknisi Dalam Perjalanan"
                    description="Teknisi sedang meluncur ke alamat service Anda."
                    extra="Estimasi tiba: 14:15 WIB"
                  />

                  {/* STATUS 4 */}
                  <StatusItem
                    title="Sedang Dikerjakan"
                    description="Proses pencucian dan pemeriksaan teknis unit AC."
                  />

                  {/* STATUS 5 */}
                  <StatusItem
                    last
                    title="Service Selesai"
                    description="Pekerjaan rampung dan kartu garansi aktif."
                  />
                </div>
              </div>

              {tracking && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700">
                  Status berhasil diperbarui untuk nomor {registration}.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INFO BOOKING ================= */}
      <section id="jadwal" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            {/* INFO */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-7 shadow-sm sm:p-8">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ff] text-[#2c5ead]">
                  <Checklist size={24} />
                </div>

                <h3 className="mb-4 text-lg font-bold text-[#0a2540] sm:text-xl">
                  Booking service AC tanpa ribet.
                </h3>

                <ul className="space-y-3 text-xs text-[#1e293b] sm:text-sm">
                  {[
                    "Pilih layanan untuk setiap unit AC",
                    "Tambahkan beberapa unit dalam satu booking",
                    "Pilih jadwal yang tersedia",
                    "Dapatkan nomor registrasi",
                    "Pantau progres service",
                  ].map((item, index) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle
                        size={16}
                        className={`shrink-0 ${
                          index % 2 === 0 ? "text-[#2c5ead]" : "text-[#1591dc]"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* JADWAL */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-7 shadow-sm sm:p-8">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ff] text-[#1591dc]">
                  <Clock3 size={24} />
                </div>

                <h3 className="mb-4 text-lg font-bold text-[#0a2540] sm:text-xl">
                  JADWAL SERVICE
                </h3>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#c4e2f5] bg-white p-3">
                    <span className="text-xs font-bold text-[#0a2540] sm:text-sm">
                      Senin – Sabtu
                    </span>
                    <span className="text-xs font-bold text-[#2c5ead] sm:text-sm">
                      10.00 – 17.00 WIB
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-[#c4e2f5] bg-white p-3">
                    <span className="text-xs font-bold text-[#0a2540] sm:text-sm">
                      Minggu
                    </span>
                    <span className="text-xs font-bold text-red-500 sm:text-sm">
                      Libur
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-[#c4e2f5] bg-[#e8f5ff] p-3.5">
                <Info size={18} className="shrink-0 text-[#1591dc]" />

                <span className="text-xs font-semibold text-[#0a2540]">
                  Booking hari yang sama tersedia selama jadwal masih tersedia.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-[#0a2540] py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2540] via-[#2c5ead] to-[#1591dc] opacity-95" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#4bb8fa]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            AC Anda Bermasalah?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-[#dcf1ff] sm:text-base">
            Booking service AC sekarang dan pilih jadwal yang tersedia.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <a
              href="#cara-booking"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-9 py-4 text-sm font-bold text-[#2c5ead] shadow-2xl transition-all hover:-translate-y-0.5 hover:bg-[#e8f5ff] sm:w-auto"
            >
              <Calendar size={21} className="text-[#1591dc]" />
              BOOKING SERVICE
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#c4e2f5] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* BRAND */}
            <div className="flex flex-col space-y-4">
              <a href="#hero" className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="SejukPro Logo"
                  className="h-10 w-auto object-contain"
                />
              </a>

              <p className="text-xs leading-relaxed text-[#434751] sm:text-sm">
                Platform booking service AC online terpercaya di Indonesia.
                Solusi mudah, transparan, dan terjadwal untuk perawatan
                pendingin udara Anda.
              </p>
            </div>

            {/* LAYANAN */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2540]">
                LAYANAN
              </h4>

              <ul className="space-y-2 text-xs text-[#434751] sm:text-sm">
                {[
                  "Cuci AC",
                  "Service AC",
                  "Isi Freon",
                  "Perbaikan AC",
                  "Bongkar & Pasang",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#layanan"
                      className="transition-colors hover:text-[#2c5ead]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* NAVIGASI */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2540]">
                NAVIGASI & PANDUAN
              </h4>

              <ul className="space-y-2 text-xs text-[#434751] sm:text-sm">
                <li>
                  <a
                    href="#hero"
                    className="transition-colors hover:text-[#2c5ead]"
                  >
                    Beranda
                  </a>
                </li>

                <li>
                  <a
                    href="#cara-booking"
                    className="transition-colors hover:text-[#2c5ead]"
                  >
                    Cara Booking
                  </a>
                </li>

                <li>
                  <a
                    href="#cek-status"
                    className="transition-colors hover:text-[#2c5ead]"
                  >
                    Cek Status
                  </a>
                </li>

                <li>
                  <a
                    href="#jadwal"
                    className="transition-colors hover:text-[#2c5ead]"
                  >
                    Jadwal Layanan
                  </a>
                </li>
              </ul>
            </div>

            {/* KONTAK */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2540]">
                KONTAK & OPERASIONAL
              </h4>

              <div className="space-y-2 text-xs text-[#434751] sm:text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#1591dc]" />
                  <span>WhatsApp: 0812-3456-7890</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#1591dc]" />
                  <span>Layanan Pelanggan: halo@sejukpro.id</span>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Clock3 size={16} className="mt-0.5 text-[#1591dc]" />

                  <div>
                    <p className="text-xs font-bold text-[#0a2540]">
                      Jam Kerja:
                    </p>

                    <p className="text-xs">Senin - Sabtu 10.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#c4e2f5] pt-6 text-xs text-[#434751] sm:flex-row">
            <p>© 2026 SejukPro AC Service. All rights reserved.</p>

            <button
              onClick={() => alert("Membuka Portal Petugas & Admin")}
              className="text-[#737782] transition-colors hover:text-[#2c5ead]"
            >
              Login Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= STATUS COMPONENT ================= */

function StatusItem({
  active = false,
  completed = false,
  current = false,
  last = false,
  title,
  description,
  extra,
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            current
              ? "bg-[#1591dc] text-white shadow-md ring-4 ring-[#1591dc]/20"
              : completed
                ? "bg-[#2c5ead] text-white shadow-sm"
                : "bg-[#dcf1ff] text-[#434751]"
          }`}
        >
          {completed ? (
            <Check size={15} />
          ) : current ? (
            <Navigation size={14} />
          ) : (
            <Construction size={14} />
          )}
        </div>

        {!last && (
          <div
            className={`h-7 w-0.5 ${
              completed ? "bg-[#2c5ead]" : "bg-[#c4e2f5]"
            }`}
          />
        )}
      </div>

      {current ? (
        <div className="flex-1 rounded-xl border border-[#c4e2f5] bg-[#e8f5ff] p-3">
          <div className="flex items-center justify-between gap-3">
            <h5 className="text-xs font-bold text-[#2c5ead] sm:text-sm">
              {title}
            </h5>

            {extra && (
              <span className="text-right text-[11px] font-bold text-[#1591dc]">
                {extra}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[11px] text-[#434751]">{description}</p>
        </div>
      ) : (
        <div>
          <h5
            className={`text-xs font-bold sm:text-sm ${
              active ? "text-[#0a2540]" : "text-[#434751]"
            }`}
          >
            {title}
          </h5>

          <p
            className={`text-[11px] ${
              active ? "text-[#434751]" : "text-[#434751]/80"
            }`}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
