import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import BookingTable from "../components/BookingTable";
import FleetSummary from "../components/FleetSummary";
import WorkloadStats from "../components/WorkloadStats";
import DispatchTimeline from "../components/DispatchTimeline";
import BookingChart from "../components/BookingChart";
import { stats, bookings, fleet, workload, dispatches, chartData } from "../data/dummy";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-soft/30">
      <Sidebar />

      <div className="flex-1 overflow-x-hidden">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-lg font-semibold text-primary">Selamat Datang, Admin</h1>
        </header>

        <main className="space-y-6 p-6">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((s) => (
              <StatCard key={s.id} {...s} />
            ))}
          </section>

          <BookingTable data={bookings} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <FleetSummary data={fleet} />
            <WorkloadStats data={workload} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DispatchTimeline data={dispatches} />
            <BookingChart data={chartData} />
          </div>
        </main>
      </div>
    </div>
  );
}