import StatCard from "../components/dashboard/StatCard";
import BookingTable from "../components/dashboard/BookingTable";
import FleetSummary from "../components/dashboard/FleetSummary";
import WorkloadStats from "../components/dashboard/WorkloadStats";
import DispatchTimeline from "../components/dashboard/DispatchTimeline";
import BookingChart from "../components/dashboard/BookingChart";
import { stats, bookings, fleet, workload, dispatches, chartData } from "../data/dummy";

export default function Dashboard() {
  return (
    <>
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
    </>
  );
}