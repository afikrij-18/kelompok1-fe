// src/pages/Dashboard.jsx
// Langkah 1: kartu statistik dan booking terbaru dari API booking.
// Armada, beban kerja, dispatch, dan grafik masih data dummy (backend belum ada).
import { useEffect, useState } from "react";
import { CalendarCheck, Clock, ClipboardCheck, CheckCircle2, Wallet } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import BookingTable from "../components/dashboard/BookingTable";
import FleetSummary from "../components/dashboard/FleetSummary";
import WorkloadStats from "../components/dashboard/WorkloadStats";
import DispatchTimeline from "../components/dashboard/DispatchTimeline";
import BookingChart from "../components/dashboard/BookingChart";
import { fleet, workload, dispatches, chartData } from "../data/dummy";
import { getBookings } from "../services/bookingService";
import { getUser } from "../services/authService";
import { hariIni } from "../utils/booking";

// Langkah 1.1: hitung lima kartu statistik dari daftar booking
// "Hari ini" = booking yang jadwalnya hari ini
const hitungStats = (bookings) => {
  const hari = hariIni();
  const jumlah = (fn) => bookings.filter(fn).length;
  const pendapatan = bookings
    .filter((b) => b.status === "Selesai")
    .reduce((j, b) => j + b.total, 0);

  return [
    { id: 1, title: "Booking Hari Ini", value: String(jumlah((b) => b.tanggal === hari)), unit: "Pesanan", icon: CalendarCheck },
    { id: 2, title: "Booking Menunggu", value: String(jumlah((b) => b.status === "Menunggu")), unit: "Pesanan", icon: Clock },
    { id: 3, title: "Dikonfirmasi", value: String(jumlah((b) => b.status === "Dikonfirmasi")), unit: "Pesanan", icon: ClipboardCheck },
    { id: 4, title: "Selesai Hari Ini", value: String(jumlah((b) => b.status === "Selesai" && b.tanggal === hari)), unit: "Servis", icon: CheckCircle2 },
    { id: 5, title: "Total Pendapatan", value: `Rp ${pendapatan.toLocaleString("id-ID")}`, unit: "", icon: Wallet },
  ];
};

export default function Dashboard() {
  const user = getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Langkah 1.2: muat booking saat halaman dibuka
  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err) =>
        setError(
          err instanceof TypeError
            ? "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."
            : err.message
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = hitungStats(bookings);

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

        {/* masih data dummy, menunggu API teknisi, dispatch, dan laporan */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FleetSummary data={fleet} />
          <WorkloadStats data={workload} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DispatchTimeline data={dispatches} />
          <BookingChart data={chartData} />
        </div>
      </main>
    </>
  );
}