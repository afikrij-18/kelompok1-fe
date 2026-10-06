import { Star, ClipboardCheck } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

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

export default function Testimonials() {
  return (
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
  );
}
