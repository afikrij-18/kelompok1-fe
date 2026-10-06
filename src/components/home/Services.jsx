import {
  Droplets,
  Wrench,
  Gauge,
  Move,
  Hammer,
  Construction,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

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

export default function Services() {
  const handleServiceClick = () => {
    document.getElementById("cara-booking")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
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
  );
}
