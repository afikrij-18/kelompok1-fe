import {
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  ChartNoAxesCombined,
} from "lucide-react";
import TrustCard from "../ui/TrustCard";

export default function Hero() {
  const handleCheckStatus = () => {
    document.getElementById("cek-status")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
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

              <button
                type="button"
                onClick={handleCheckStatus}
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#1591dc] transition-colors hover:text-[#2c5ead] sm:text-sm"
              >
                Sudah booking? Cek status service
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
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
  );
}
