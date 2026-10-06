import {
  BadgeCheck,
  CalendarDays,
  ReceiptText,
  Zap,
  ChartNoAxesCombined,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

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

export default function WhyUs() {
  return (
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
  );
}
