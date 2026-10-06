import {
  Snowflake,
  BadgeCheck,
  Phone,
  Mail,
  Clock3,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#c4e2f5] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
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
              Menghubungkan Anda dengan teknisi profesional bersertifikat, harga
              pasti transparan, dan pemantauan online mandiri.
            </p>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#c4e2f5] bg-[#e8f5ff] px-3 py-1.5 text-xs font-bold text-[#2c5ead]">
              <BadgeCheck className="h-4 w-4" />
              Garansi Resmi 30 Hari
            </div>
          </div>

          {/* LAYANAN */}
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

          {/* INFORMASI */}
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

          {/* KONTAK */}
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

                  <p className="text-xs">Senin - Minggu (08:00 - 20:00 WIB)</p>
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

        {/* COPYRIGHT */}
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
                window.location.href = "/login"
              }
              className="font-medium underline hover:text-[#2c5ead]"
            >
              Login Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
