// src/pages/JadwalDispatch.jsx
// Langkah 1: jadwal booking per hari dan per minggu (hanya baca).
// Penugasan teknisi (dispatch) menunggu backend.
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, Clock } from "lucide-react";
import { getBookings } from "../services/bookingService";
import { hariIni, toISO, formatTanggalPanjang } from "../utils/booking";

const badgeColor = {
  Menunggu: "bg-yellow-100 text-yellow-700",
  Dikonfirmasi: "bg-soft text-primary",
  Selesai: "bg-green-100 text-green-700",
  Dibatalkan: "bg-red-100 text-red-700",
};

// Langkah 1.1: fungsi bantu tanggal, semua memakai format YYYY-MM-DD
const geser = (iso, hari) => {
  const d = new Date(`${iso}T00:00`);
  d.setDate(d.getDate() + hari);
  return toISO(d);
};
// Senin dari minggu yang memuat tanggal ini
const awalMinggu = (iso) => {
  const d = new Date(`${iso}T00:00`);
  return geser(iso, -((d.getDay() + 6) % 7));
};
const namaHari = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString("id-ID", { weekday: "short" });
const angkaTanggal = (iso) => Number(iso.slice(8, 10));

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function JadwalDispatch() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tanggal, setTanggal] = useState(hariIni());

  // Langkah 1.2: muat semua booking saat halaman dibuka
  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, []);

  // Langkah 1.3: booking dibatalkan tidak dihitung di jumlah, tetapi tetap tampil di daftar harian
  const aktif = bookings.filter((b) => b.status !== "Dibatalkan");
  const jumlahPerHari = (iso) => aktif.filter((b) => b.tanggal === iso).length;

  const daftarHari = bookings
    .filter((b) => b.tanggal === tanggal)
    .sort((a, b) => a.jam.localeCompare(b.jam));
  const aktifHari = daftarHari.filter((b) => b.status !== "Dibatalkan");
  const jumlahUnit = aktifHari.reduce((j, b) => j + b.items.length, 0);

  // Langkah 1.4: tujuh hari dalam minggu yang dipilih
  const hariMinggu = Array.from({ length: 7 }, (_, i) =>
    geser(awalMinggu(tanggal), i),
  );
  const hariIniIso = hariIni();

  const tombolNav = "rounded-lg border border-gray-300 p-2 hover:bg-soft";

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">
          Jadwal & Dispatch
        </h1>
      </header>

      <main className="space-y-6 p-6">
        {error && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading && <p className="text-sm text-gray-500">Memuat jadwal...</p>}

        {!loading && !error && (
          <>
            {/* Langkah 1.5: navigasi tanggal */}
            <div className="rounded-xl bg-white p-5 shadow">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setTanggal(geser(tanggal, -1))}
                  title="Hari sebelumnya"
                  className={tombolNav}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setTanggal(geser(tanggal, 1))}
                  title="Hari berikutnya"
                  className={tombolNav}
                >
                  <ChevronRight size={18} />
                </button>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => e.target.value && setTanggal(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={() => setTanggal(hariIniIso)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-soft"
                >
                  Hari Ini
                </button>
                <p className="ml-auto text-sm font-semibold text-primary">
                  {formatTanggalPanjang(tanggal)}
                </p>
              </div>

              {/* Langkah 1.6: ringkasan minggu, klik untuk pindah hari */}
              <div className="mt-4 grid grid-cols-7 gap-2">
                {hariMinggu.map((iso) => {
                  const pilih = iso === tanggal;
                  const jumlah = jumlahPerHari(iso);
                  return (
                    <button
                      key={iso}
                      onClick={() => setTanggal(iso)}
                      className={`rounded-lg border px-1 py-2 text-center text-xs ${
                        pilih
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 hover:bg-soft"
                      } ${iso === hariIniIso && !pilih ? "ring-2 ring-accent" : ""}`}
                    >
                      <span className="block capitalize">{namaHari(iso)}</span>
                      <span className="block text-base font-bold">
                        {angkaTanggal(iso)}
                      </span>
                      <span
                        className={`block ${pilih ? "text-white/80" : "text-gray-500"}`}
                      >
                        {jumlah > 0 ? `${jumlah} booking` : "-"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Langkah 1.7: daftar booking pada tanggal terpilih, urut jam */}
            <section className="rounded-xl bg-white p-5 shadow">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold text-primary">
                  Jadwal Hari Ini
                </h2>
                <p className="text-xs text-gray-500">
                  {aktifHari.length} booking, {jumlahUnit} unit AC
                </p>
              </div>

              {daftarHari.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Tidak ada booking pada tanggal ini
                </p>
              ) : (
                <ul className="space-y-3">
                  {daftarHari.map((b) => (
                    <li
                      key={b.id}
                      className={`flex gap-4 rounded-lg border border-gray-100 p-4 ${
                        b.status === "Dibatalkan" ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex w-16 shrink-0 flex-col items-center">
                        <Clock size={16} className="text-secondary" />
                        <span className="mt-1 text-lg font-bold text-primary">
                          {b.jam}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-gray-500">
                            {b.kode}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              badgeColor[b.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <p className="mt-1 font-medium">{b.pelanggan}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <Phone size={12} /> {b.telepon}
                        </p>
                        <p className="mt-0.5 flex items-start gap-1 text-xs text-gray-500">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          <span>
                            {b.alamat}
                            {b.catatanLokasi && ` (${b.catatanLokasi})`}
                          </span>
                        </p>

                        <ul className="mt-2 space-y-0.5">
                          {b.items.map((it) => (
                            <li key={it.id} className="text-xs">
                              <span className="text-gray-500">{it.unit}:</span>{" "}
                              {it.layanan}{" "}
                              <span className="text-gray-400">
                                ({it.merek} {it.kapasitas})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-xs text-gray-400">
                Penugasan teknisi akan tersedia setelah backend mendukungnya.
              </p>
            </section>
          </>
        )}
      </main>
    </>
  );
}