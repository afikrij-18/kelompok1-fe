import { CalendarDays, Check } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#024594] py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-[#024594] via-[#2c5ead] to-[#1591dc] opacity-95" />

      {/* Decorative blur */}
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
  );
}
