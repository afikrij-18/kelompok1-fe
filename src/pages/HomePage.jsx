import { useState } from "react";
import {
  Snowflake,
  CalendarDays,
  Search,
  ShieldCheck,
  Droplets,
  Wrench,
  Gauge,
  Move,
  Hammer,
  BadgeCheck,
  ReceiptText,
  Zap,
  ChartNoAxesCombined,
  Phone,
  Mail,
  Clock3,
  MapPin,
  Check,
  ArrowRight,
  Star,
  Construction,
  Navigation,
  Menu,
  X,
  CalendarCheck,
  ClipboardCheck,
  TextSearch,
  TicketCheck,
  Info,
} from "lucide-react";

const services = [
  {
    name: "Cuci AC",
    price: 75000,
    icon: Droplets,
    color: "primary",
    popular: true,
    description:
      "Pembersihan menyeluruh evaporator, blower, & filter AC untuk udara lebih segar & dingin optimal. Bebas lumut dan bakteri.",
  },
  {
    name: "Service AC",
    price: 110000,
    icon: Wrench,
    color: "secondary",
    description:
      "Perawatan berkala, pembersihan mendalam, pengecekan tekanan angin & komponen kelistrikan lengkap untuk mencegah kerusakan dini.",
  },
  {
    name: "Isi Freon",
    price: 150000,
    icon: Gauge,
    color: "primary",
    description:
      "Pengisian dan penambahan freon murni berkualitas sesuai standar pabrikan pendingin ruangan. Uji tekanan presisi tinggi.",
  },
  {
    name: "Perbaikan AC",
    price: 125000,
    icon: Hammer,
    color: "secondary",
    description:
      "Diagnosa & penanganan cepat untuk AC bocor air/freon, berisik, tidak dingin, bau apek, mati total, atau permasalahan PCB modul.",
  },
  {
    name: "Bongkar AC",
    price: 100000,
    icon: Move,
    color: "primary",
    description:
      "Pembongkaran unit AC indoor & outdoor secara rapi dan aman dengan metode pump down agar freon tidak terbuang percuma.",
  },
  {
    name: "Pasang AC",
    price: 250000,
    icon: Construction,
    color: "secondary",
    description:
      "Instalasi unit AC baru maupun relokasi unit lama. Dilengkapi proses vacuum pipa tembaga sesuai petunjuk pabrik untuk pendinginan optimal.",
  },
];

const benefits = [
  {
    title: "Teknisi Berpengalaman",
    description:
      "Ditangani oleh teknisi yang berpengalaman dalam perawatan dan perbaikan AC dari beragam tipe dan merk terkemuka.",
    icon: BadgeCheck,
    color: "primary",
  },
  {
    title: "Jadwal Terjadwal",
    description:
      "Pilih tanggal dan waktu service berdasarkan jadwal yang tersedia dengan estimasi kedatangan yang pasti.",
    icon: CalendarDays,
    color: "secondary",
  },
  {
    title: "Harga Transparan",
    description:
      "Informasi harga layanan ditampilkan dengan jelas sebelum melakukan booking tanpa pungutan biaya siluman.",
    icon: ReceiptText,
    color: "primary",
  },
  {
    title: "Respon Cepat",
    description:
      "Permintaan service dapat dilakukan dengan mudah langsung melalui website tanpa harus antre atau datang langsung.",
    icon: Zap,
    color: "secondary",
  },
  {
    title: "Pantau Progres Online",
    description:
      "Cek status service menggunakan nomor registrasi dan nomor HP secara instan langsung dari ponsel Anda.",
    icon: ChartNoAxesCombined,
    color: "primary",
  },
  {
    title: "Proses Terpantau",
    description:
      "Pantau perkembangan service mulai dari booking, penugasan teknisi, pengerjaan, hingga selesai dan nota bergaransi.",
    icon: BadgeCheck,
    color: "secondary",
  },
];

const testimonials = [
  {
    name: "Budi Santoso",
    service: "Service AC & Cuci 2 Unit",
    text: "Pelayanan sangat baik dan teknisinya datang sesuai jadwal. Hasil cuci AC sangat bersih, tidak ada cipratan air di dinding kamar tidur, dan udaranya langsung dingin menusuk kembali.",
  },
  {
    name: "Ratna Pratiwi",
    service: "Isi Freon R32 & Cuci AC",
    text: "Harga sangat transparan dan sesuai dengan yang tertera di website. Teknisi mengukur tekanan freon di depan saya sebelum pengisian. Sangat jujur dan profesional!",
  },
  {
    name: "Hendra Gunawan",
    service: "Pasang AC Inverter",
    text: "Fitur Cek Status dengan nomor registrasinya mantap sekali! Saya tahu persis kapan teknisi sedang meluncur tanpa harus telpon admin berkali-kali. Pemasangan AC baru sangat rapi.",
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

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [registration, setRegistration] = useState("AC-2026-00128");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleCheckStatus = (event) => {
    event.preventDefault();

    if (!registration.trim()) {
      setMessage("Silakan masukkan nomor registrasi.");
      setTracking(false);
      return;
    }

    if (!phone.trim()) {
      setMessage("Silakan masukkan nomor HP / WhatsApp.");
      setTracking(false);
      return;
    }

    setTracking(true);
    setMessage(
      `Status booking ${registration.toUpperCase()} berhasil ditemukan.`,
    );
  };

  const handleServiceClick = () => {
    document.getElementById("cara-booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5faff] text-[#001e2c] antialiased">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#c4e2f5] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#hero"
            className="group flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2c5ead] text-white shadow-md shadow-[#2c5ead]/25 transition-transform group-hover:scale-105">
              <Snowflake className="h-6 w-6 text-[#4bb8fa]" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none tracking-tight text-[#024594] sm:text-2xl">
                Sejuk<span className="text-[#1591dc]">Pro</span>
              </span>

              <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[#434751] sm:text-[10px]">
                AC Service & Booking
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex lg:gap-2">
            <a
              href="#hero"
              className="rounded-lg bg-[#e8f5ff] px-3.5 py-2 text-xs font-bold text-[#2c5ead]"
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
              href="#kenapa-kami"
              className="rounded-lg px-3.5 py-2 text-xs font-bold text-[#434751] transition-colors hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
            >
              Keunggulan
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
              <ChartNoAxesCombined className="h-4 w-4 text-[#1591dc]" />
              Cek Status
            </a>
          </nav>

          <div className="hidden md:flex">
            <a
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c5ead] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#2c5ead]/30 transition-all hover:-translate-y-0.5 hover:bg-[#1e488d] sm:text-sm"
            >
              <CalendarDays className="h-4 w-4" />
              Booking Service
            </a>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-[#2c5ead] md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#c4e2f5] bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {[
                ["#hero", "Beranda"],
                ["#layanan", "Layanan"],
                ["#kenapa-kami", "Keunggulan"],
                ["#cara-booking", "Cara Booking"],
                ["#cek-status", "Cek Status"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-bold text-[#434751] hover:bg-[#e8f5ff] hover:text-[#2c5ead]"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#c4e2f5] bg-linear-to-b from-[#e8f5ff] via-[#f5faff] to-white pb-16 pt-8 md:pb-24 md:pt-14"
      >
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1591dc]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-[#4bb8fa]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="flex flex-col items-start space-y-6 lg:col-span-7">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#024594] sm:text-4xl lg:text-5xl">
                AC BERMASALAH?
                <br />
                <span className="bg-linear-to-r from-[#2c5ead] to-[#1591dc] bg-clip-text text-transparent">
                  KAMI SIAP MEMBANTU.
                </span>
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-[#434751] sm:text-base">
                Pesan jasa service AC dengan mudah, pilih jadwal yang tersedia,
                dan pantau progres service Anda secara online tanpa ribet.
                Dikerjakan langsung oleh teknisi tersertifikasi.
              </p>

              <div className="flex w-full flex-wrap items-center gap-5 pt-2 sm:w-auto">
                <a
                  href="/booking"
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
                <TrustCard
                  icon={ShieldCheck}
                  title="Teknisi Berpengalaman"
                  description="Sertifikat HVAC Resmi"
                />

                <TrustCard
                  icon={CalendarDays}
                  title="Pilih Jadwal Service"
                  description="Slot Jam Fleksibel"
                  secondary
                />

                <TrustCard
                  icon={ChartNoAxesCombined}
                  title="Pantau Progres Online"
                  description="Live Tracking Mandiri"
                  secondary
                />
              </div>
            </div>

            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-md">
                <div className="relative overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-2xl">
                  <img
                    alt="Teknisi AC SejukPro profesional sedang mencuci unit AC indoor di rumah pelanggan"
                    className="h-112.5 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1VRsiISaCMNNY0bR5kL8sVsUCSygKnT5UzRjlwWo2SqdNXf-w0ypZ3aU1Vw6G2ri6ql22tvtdF2slz8pG56KD-H33PAMN80OZ_ZcXDe1k99p01H3ykMl2NLt7oi6HBUydgzcEkk96IXVAaBJXNPnQbHGWnQwu80uXkg5IZNH5i2Slyz_h3IlcaWxufDSnWO9EwVDgF57Nu2ZLQubGI-yowrX8m35VJjF1etCgKV57RCy4zzQIEgRJveW_Y"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#024594]/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="LAYANAN KAMI"
            description="Pilih layanan service AC sesuai kebutuhan Anda dengan biaya pasti tanpa biaya siluman."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.name}
                  className="group flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-6 shadow-sm transition-all duration-300 hover:border-[#1591dc] hover:shadow-xl"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          service.color === "secondary"
                            ? "text-[#1591dc] group-hover:bg-[#1591dc]"
                            : "text-[#2c5ead] group-hover:bg-[#2c5ead]"
                        } bg-[#e8f5ff] shadow-sm transition-colors group-hover:text-white`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      {service.popular && (
                        <span className="rounded bg-[#c9e6ff] px-2 py-0.5 text-[10px] font-bold text-[#024594]">
                          Terpopuler
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#024594] transition-colors group-hover:text-[#2c5ead] sm:text-lg">
                      {service.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#434751] sm:text-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#c4e2f5] pt-4">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#434751]">
                        Mulai Dari
                      </span>

                      <span className="text-lg font-bold text-[#024594] sm:text-xl">
                        Rp{service.price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleServiceClick}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#2c5ead] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1591dc]"
                    >
                      BOOKING
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section
        id="kenapa-kami"
        className="border-y border-[#c4e2f5] bg-[#f5faff] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="KENAPA PILIH KAMI?"
            description="Service AC lebih mudah, terjadwal, dan transparan tanpa rasa was-was."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-[#c4e2f5] bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5ff] ${
                      benefit.color === "secondary"
                        ? "text-[#1591dc]"
                        : "text-[#2c5ead]"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-base font-bold text-[#024594]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#434751] sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKING STEPS */}
      <section id="cara-booking" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="CARA BOOKING SERVICE"
            description="Booking service AC dengan mudah dalam beberapa langkah."
          />

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
            <a
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c5ead] px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#2c5ead]/25 transition-all hover:-translate-y-0.5 hover:bg-[#1f4684] sm:text-sm"
            >
              BOOKING SERVICE SEKARANG
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section
        id="cek-status"
        className="border-t border-[#c4e2f5] bg-[#f5faff] py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="SUDAH MELAKUKAN BOOKING?"
            description="Pantau status service AC Anda menggunakan nomor registrasi."
          />

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
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
                      onChange={(event) =>
                        setRegistration(event.target.value.toUpperCase())
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
                      onChange={(event) => setPhone(event.target.value)}
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
                  <StatusItem
                    completed
                    title="Booking Dikonfirmasi"
                    description="Pesanan Anda telah diterima dalam sistem jadwal."
                  />

                  <StatusItem
                    completed
                    title="Teknisi Ditugaskan"
                    description="Teknisi Bpk. Rahmat Santoso siap bertugas."
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

              {tracking && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700">
                  Status berhasil diperbarui untuk nomor {registration}.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimoni" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="ULASAN KEPUASAN"
            title="TESTIMONI PELANGGAN"
            description="Pengalaman nyata pelanggan setelah menggunakan layanan service AC kami."
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-7 shadow-sm"
              >
                <div>
                  <div className="mb-3 flex items-center gap-1 text-[#1591dc]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-current sm:h-5 sm:w-5"
                      />
                    ))}
                  </div>

                  <p className="text-xs italic leading-relaxed text-[#434751] sm:text-sm">
                    "{testimonial.text}"
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#c4e2f5] pt-4">
                  <div>
                    <p className="text-xs font-bold text-[#024594] sm:text-sm">
                      {testimonial.name}
                    </p>

                    <p className="text-[11px] font-semibold text-[#1591dc]">
                      {testimonial.service}
                    </p>
                  </div>

                  <span className="rounded border border-[#c4e2f5] bg-[#e8f5ff] px-2 py-0.5 text-[10px] font-bold text-[#2c5ead]">
                    Terverifikasi
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="#testimoni"
              className="inline-flex items-center gap-2 rounded-xl border border-[#c4e2f5] bg-white px-6 py-3 text-xs font-bold text-[#2c5ead] shadow-sm transition-colors hover:bg-[#e8f5ff] sm:text-sm"
            >
              LIHAT SEMUA TESTIMONI
              <ClipboardCheck className="h-4 w-4 text-[#1591dc]" />
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#024594] py-20">
        <div className="absolute inset-0 bg-linear-to-r from-[#024594] via-[#2c5ead] to-[#1591dc] opacity-95" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#4bb8fa]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            AC ANDA BERMASALAH?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-[#dcf1ff] sm:text-base">
            Booking service AC dengan mudah dan pilih jadwal yang tersedia.
            Nikmati udara bersih, sejuk, dan hemat listrik sekarang juga.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/booking"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-9 py-4 text-sm font-bold text-[#2c5ead] shadow-2xl transition-all hover:-translate-y-0.5 hover:bg-[#e8f5ff] sm:w-auto"
            >
              <CalendarDays className="h-5 w-5 text-[#1591dc]" />
              BOOKING SERVICE
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#dcf1ff]">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#4bb8fa]" />
              Tanpa Biaya Tersembunyi
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#4bb8fa]" />
              Garansi Service 30 Hari
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#4bb8fa]" />
              Teknisi Profesional & Bersertifikat
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#c4e2f5] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2c5ead] text-white shadow-sm">
                  <Snowflake className="h-5 w-5 text-[#4bb8fa]" />
                </div>

                <span className="text-xl font-bold tracking-tight text-[#024594] sm:text-2xl">
                  Sejuk<span className="text-[#1591dc]">Pro</span>
                </span>
              </div>

              <p className="text-xs leading-relaxed text-[#434751] sm:text-sm">
                Platform booking service AC online terpercaya di Indonesia.
                Menghubungkan Anda dengan teknisi profesional bersertifikat,
                harga pasti transparan, dan pemantauan online mandiri.
              </p>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#c4e2f5] bg-[#e8f5ff] px-3 py-1.5 text-xs font-bold text-[#2c5ead]">
                <BadgeCheck className="h-4 w-4" />
                Garansi Resmi 30 Hari
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#024594]">
                LAYANAN
              </h4>

              <ul className="space-y-2 text-xs text-[#434751] sm:text-sm">
                {[
                  "Cuci AC",
                  "Service AC",
                  "Isi Freon (R32 / R410A / R22)",
                  "Perbaikan AC Bocor & Mati",
                  "Bongkar / Pasang AC",
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

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#024594]">
                INFORMASI
              </h4>

              <ul className="space-y-2 text-xs text-[#434751] sm:text-sm">
                <li>
                  <a href="#hero" className="hover:text-[#2c5ead]">
                    Tentang Kami
                  </a>
                </li>

                <li>
                  <a href="#cara-booking" className="hover:text-[#2c5ead]">
                    Cara Booking
                  </a>
                </li>

                <li>
                  <a href="#cek-status" className="hover:text-[#2c5ead]">
                    Cek Status Service
                  </a>
                </li>

                <li>
                  <a href="#testimoni" className="hover:text-[#2c5ead]">
                    Testimoni Pelanggan
                  </a>
                </li>

                <li>
                  <span className="text-[#434751]/70">
                    Area Layanan: Jabodetabek, Bandung, Surabaya
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#024594]">
                KONTAK & OPERASIONAL
              </h4>

              <div className="space-y-3 text-xs text-[#434751] sm:text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#1591dc]" />
                  <span>0812-3456-7890 (WhatsApp & Call)</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1591dc]" />
                  <span>halo@sejukpro.id</span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 text-[#1591dc]" />

                  <div>
                    <p className="text-xs font-bold text-[#024594]">
                      Jam Operasional:
                    </p>

                    <p className="text-xs">
                      Senin - Minggu (08:00 - 20:00 WIB)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#1591dc]" />

                  <p className="text-xs">
                    Gedung SejukPro Lt. 3, Jl. Kebon Jeruk No. 88, Jakarta Barat
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#c4e2f5] pt-6 text-xs text-[#434751] md:flex-row">
            <div className="flex flex-wrap items-center gap-4">
              <span>
                © 2026 SejukPro Indonesia. Seluruh hak cipta dilindungi.
              </span>

              <a href="#" className="hover:text-[#2c5ead]">
                Kebijakan Privasi
              </a>

              <a href="#" className="hover:text-[#2c5ead]">
                Syarat & Ketentuan
              </a>
            </div>

            <div>
              <span>Area Petugas: </span>

              <button
                type="button"
                onClick={() =>
                  window.alert("Membuka Portal Khusus Admin & Teknisi SejukPro")
                }
                className="font-medium underline hover:text-[#2c5ead]"
              >
                Login Admin
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatusItem({
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
              completed ? "text-[#0a2540]" : "text-[#434751]"
            }`}
          >
            {title}
          </h5>

          <p className="text-[11px] text-[#434751]">{description}</p>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-[#1591dc]">
          {eyebrow}
        </span>
      )}

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#024594] sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      <p className="mt-2 text-xs text-[#434751] sm:text-sm">{description}</p>
    </div>
  );
}

function TrustCard({ icon: Icon, title, description, secondary = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#c4e2f5] bg-white p-3 shadow-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f5ff] ${
          secondary ? "text-[#1591dc]" : "text-[#2c5ead]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-[#024594]">{title}</p>

        <p className="truncate text-[10px] text-[#434751]">{description}</p>
      </div>
    </div>
  );
}
