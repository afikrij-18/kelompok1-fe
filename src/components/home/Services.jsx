// src/components/home/Services.jsx
// Langkah 4: layanan homepage dari API, mengikuti menu Layanan AC di admin
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Droplets,
  Wrench,
  Gauge,
  Move,
  Hammer,
  Construction,
  Snowflake,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import useLayananPublik from "../hooks/useLayananPublik";

// Langkah 4.1: ikon dipilih dari kata di nama layanan, urutan penting (yang paling spesifik dulu)
const IKON = [
  [/cuci/i, Droplets],
  [/freon/i, Gauge],
  [/bongkar/i, Move],
  [/pasang|instal/i, Construction],
  [/perbaik|repair/i, Hammer],
  [/service|servis|perawatan/i, Wrench],
];
const ikonLayanan = (nama) =>
  (IKON.find(([pola]) => pola.test(nama)) || [null, Snowflake])[1];

export default function Services() {
  const { layanan, perKategori, loading, error } = useLayananPublik();
  // "Semua" atau id kategori
  const [kategoriId, setKategoriId] = useState("Semua");

  // Langkah 4.2: layanan yang tampil sesuai filter kategori
  const tampil =
    kategoriId === "Semua"
      ? layanan
      : perKategori.find((k) => k.id === kategoriId)?.layanan || [];

  const tombolFilter = (aktif) =>
    `rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
      aktif
        ? "border-[#2c5ead] bg-[#2c5ead] text-white"
        : "border-[#c4e2f5] bg-white text-[#434751] hover:bg-[#e8f5ff]"
    }`;

  return (
    <section id="layanan" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="LAYANAN KAMI"
          description="Pilih layanan service AC sesuai kebutuhan Anda dengan biaya pasti tanpa biaya siluman."
        />

        {/* Langkah 4.3: filter kategori, hanya tampil jika ada lebih dari satu kategori */}
        {!loading && !error && perKategori.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setKategoriId("Semua")}
              className={tombolFilter(kategoriId === "Semua")}
            >
              Semua
            </button>
            {perKategori.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setKategoriId(k.id)}
                className={tombolFilter(kategoriId === k.id)}
              >
                {k.nama}
              </button>
            ))}
          </div>
        )}

        {/* Langkah 4.4: kerangka saat memuat */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 animate-pulse rounded-2xl border border-[#c4e2f5] bg-[#f5faff]"
              />
            ))}
          </div>
        )}

        {/* gagal memuat */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-8 text-center">
            <p className="text-sm text-[#434751]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#2c5ead] px-5 py-2 text-xs font-bold text-white hover:bg-[#1f4684]"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {/* belum ada layanan */}
        {!loading && !error && layanan.length === 0 && (
          <p className="text-center text-sm text-[#434751]">
            Daftar layanan akan segera tersedia.
          </p>
        )}

        {/* Langkah 4.5: kartu layanan */}
        {!loading && !error && tampil.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tampil.map((service, i) => {
              const Icon = ikonLayanan(service.nama);
              const biru = i % 2 === 1; // warna ikon bergantian

              return (
                <div
                  key={service.id}
                  className="group flex flex-col justify-between rounded-2xl border border-[#c4e2f5] bg-[#f5faff] p-6 shadow-sm transition-all duration-300 hover:border-[#1591dc] hover:shadow-xl"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          biru
                            ? "text-[#1591dc] group-hover:bg-[#1591dc]"
                            : "text-[#2c5ead] group-hover:bg-[#2c5ead]"
                        } bg-[#e8f5ff] shadow-sm transition-colors group-hover:text-white`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>

                      {service.kategori && (
                        <span className="rounded bg-[#c9e6ff] px-2 py-0.5 text-[10px] font-bold text-[#024594]">
                          {service.kategori}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#024594] transition-colors group-hover:text-[#2c5ead] sm:text-lg">
                      {service.nama}
                    </h3>

                    <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-[#434751] sm:text-sm">
                      {service.deskripsi ||
                        "Hubungi kami untuk informasi lebih lanjut tentang layanan ini."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#c4e2f5] pt-4">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-[#434751]">
                        Harga
                      </span>

                      <span className="text-lg font-bold text-[#024594] sm:text-xl">
                        Rp{service.harga.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <Link
                      to="/pesan"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#2c5ead] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1591dc]"
                    >
                      BOOKING
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}