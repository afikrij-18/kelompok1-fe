import { ArrowRight } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

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

export default function BookingSteps() {
  return (
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
  );
}
