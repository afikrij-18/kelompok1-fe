// src/pages/Dashboard.jsx
// Langkah 4: kartu statistik dan booking terbaru dari API.
// Armada, beban kerja, dispatch, dan grafik dihitung dari data backend (bukan dummy).
import { useEffect, useState } from "react";
import { CalendarCheck, Clock, ClipboardCheck, CheckCircle2, Wallet } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import BookingTable from "../components/dashboard/BookingTable";
import FleetSummary from "../components/dashboard/FleetSummary";
import WorkloadStats from "../components/dashboard/WorkloadStats";
import DispatchTimeline from "../components/dashboard/DispatchTimeline";
import BookingChart from "../components/dashboard/BookingChart";
import { getBookings } from "../services/bookingService";
import { getSalesReport } from "../services/transactionService";
import { getTechnicians } from "../services/technicianService";
import { getUser } from "../services/authService";
import { hariIni, toISO } from "../utils/booking";

// Langkah 4.1: hitung lima kartu statistik. "Hari ini" = booking yang jadwalnya hari ini.
// omzet null berarti laporan gagal dimuat, kartu menampilkan "-"
const hitungStats = (bookings, omzet) => {
  const hari = hariIni();
  const jumlah = (fn) => bookings.filter(fn).length;

  return [
    { id: 1, title: "Booking Hari Ini", value: String(jumlah((b) => b.tanggal === hari)), unit: "Pesanan", icon: CalendarCheck },
    { id: 2, title: "Booking Menunggu", value: String(jumlah((b) => b.status === "Menunggu")), unit: "Pesanan", icon: Clock },
    { id: 3, title: "Dikonfirmasi", value: String(jumlah((b) => b.status === "Dikonfirmasi")), unit: "Pesanan", icon: ClipboardCheck },
    { id: 4, title: "Selesai Hari Ini", value: String(jumlah((b) => b.status === "Selesai" && b.tanggal === hari)), unit: "Servis", icon: CheckCircle2 },
    {
      id: 5,
      title: "Total Pendapatan",
      value: omzet === null ? "-" : `Rp ${omzet.toLocaleString("id-ID")}`,
      unit: "",
      icon: Wallet,
    },
  ];
};

// Kesiapan armada dari data teknisi + penugasan hari ini
const hitungFleet = (teknisiList, bookings) => {
  const hari = hariIni();
  const aktif = teknisiList.filter((t) => t.status === "Aktif");
  const nonaktif = teknisiList.filter((t) => t.status !== "Aktif");

  const bertugasIds = new Set(
    bookings
      .filter(
        (b) =>
          b.tanggal === hari &&
          b.status !== "Dibatalkan" &&
          b.status !== "Selesai" &&
          b.teknisiId,
      )
      .map((b) => String(b.teknisiId)),
  );

  const bertugas = aktif.filter((t) => bertugasIds.has(String(t.id))).length;
  const siap = Math.max(aktif.length - bertugas, 0);

  return [
    { id: 1, value: String(siap), label: "Siap / Siaga" },
    { id: 2, value: String(bertugas), label: "Bertugas Aktif" },
    { id: 3, value: String(nonaktif.length), label: "Izin / Libur" },
  ];
};

// Statistik beban kerja dari data booking
const hitungWorkload = (bookings) => {
  const aktif = bookings.filter((b) => b.status !== "Dibatalkan");
  const tanggalUnik = new Set(aktif.map((b) => b.tanggal));
  const rataHarian =
    tanggalUnik.size === 0 ? 0 : Math.round((aktif.length / tanggalUnik.size) * 10) / 10;

  const denganTeknisi = aktif.filter((b) => b.teknisiId).length;
  const sla = aktif.length === 0 ? 0 : Math.round((denganTeknisi / aktif.length) * 100);

  // Jam beban tertinggi: jam (HH) paling sering muncul
  const perJam = {};
  aktif.forEach((b) => {
    const hh = String(b.jam || "").slice(0, 2);
    if (/^\d{2}$/.test(hh)) perJam[hh] = (perJam[hh] || 0) + 1;
  });
  let jamTertinggi = "-";
  const entri = Object.entries(perJam).sort((a, b) => b[1] - a[1]);
  if (entri.length > 0) {
    const hh = Number(entri[0][0]);
    jamTertinggi = `${String(hh).padStart(2, "0")}:00 - ${String(hh + 2).padStart(2, "0")}:00`;
  }

  const totalUnit = aktif.reduce((j, b) => j + (b.items?.length || 0), 0);
  const rataUnit =
    aktif.length === 0 ? 0 : Math.round((totalUnit / aktif.length) * 10) / 10;

  return [
    { id: 1, label: "Rata-rata Harian", value: String(rataHarian), unit: "Tiket" },
    { id: 2, label: "Booking Ada Teknisi", value: String(sla), unit: "%" },
    { id: 3, label: "Jam Beban Tertinggi", value: jamTertinggi, unit: "" },
    { id: 4, label: "Rata-rata Unit / Booking", value: String(rataUnit), unit: "unit" },
  ];
};

// Dispatch hari ini dari booking yang terjadwal hari ini
const hitungDispatch = (bookings) => {
  const hari = hariIni();
  return bookings
    .filter((b) => b.tanggal === hari)
    .sort((a, b) => String(a.jam || "").localeCompare(String(b.jam || "")))
    .slice(0, 8)
    .map((b) => ({
      id: b.id,
      jam: b.jam || "-",
      teknisi: b.teknisi || "Belum ditugaskan",
      aktivitas: `${(b.items || []).map((it) => it.layanan).filter(Boolean).join(", ") || "Servis AC"} — ${b.pelanggan} (${b.kode})`,
    }));
};

// Booking per hari: 7 hari terakhir termasuk hari ini
const hitungChart = (bookings) => {
  const hasil = [];
  const dasar = new Date(`${hariIni()}T00:00`);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(dasar);
    d.setDate(d.getDate() - i);
    const iso = toISO(d);
    const label = d.toLocaleDateString("id-ID", { weekday: "short" });
    const jumlah = bookings.filter((b) => b.tanggal === iso && b.status !== "Dibatalkan").length;
    hasil.push({ hari: label, booking: jumlah });
  }
  return hasil;
};

// TypeError berarti fetch gagal terhubung (backend mati / alamat salah)
const pesanError = (err) =>
  err instanceof TypeError
    ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
    : err.message;

export default function Dashboard() {
  const user = getUser();
  const [bookings, setBookings] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);
  const [omzet, setOmzet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Langkah 4.2: muat booking, laporan, dan teknisi sekaligus saat halaman dibuka
  useEffect(() => {
    let batal = false;
    setLoading(true);
    Promise.all([getBookings(1, 100), getSalesReport(), getTechnicians()])
      .then(([resBooking, laporan, teknisi]) => {
        if (batal) return;
        setBookings(resBooking.data || []);
        setOmzet(laporan?.totalOmzet ?? null);
        setTeknisiList(Array.isArray(teknisi) ? teknisi : []);
        setError("");
      })
      .catch((err) => {
        if (batal) return;
        // omzet gagal tidak dianggap fatal (kartu "-" saja), yang fatal kalau booking gagal
        setError(pesanError(err));
        // coba tetap tampilkan teknisi/omzet yang berhasil? karena Promise.all gagal semua,
        // biarkan kosong agar konsisten
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });
    return () => {
      batal = true;
    };
  }, []);

  const stats = hitungStats(bookings, omzet);
  const fleet = hitungFleet(teknisiList, bookings);
  const workload = hitungWorkload(bookings);
  const dispatches = hitungDispatch(bookings);
  const chartData = hitungChart(bookings);

  return (
    <>
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-primary">
          Selamat Datang, {user?.name || "Admin"}
        </h1>
      </header>

      <main className="space-y-6 p-6">
        {error && <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </section>

        <BookingTable data={bookings} loading={loading} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FleetSummary data={fleet} loading={loading} />
          <WorkloadStats data={workload} loading={loading} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DispatchTimeline data={dispatches} loading={loading} />
          <BookingChart data={chartData} loading={loading} />
        </div>
      </main>
    </>
  );
}
