export default function DispatchTimeline({ data, loading }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold text-primary">Jadwal & Live Dispatch</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat...</p>
      ) : (
        <ul className="ml-2 border-l-2 border-secondary">
          {data.map((d) => (
            <li key={d.id} className="relative mb-5 pl-6 last:mb-0">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary" />
              <p className="text-sm font-semibold">{d.jam} - {d.teknisi}</p>
              <p className="text-sm text-gray-500">{d.aktivitas}</p>
            </li>
          ))}
          {data.length === 0 && <p className="text-sm text-gray-500">Tidak ada jadwal hari ini</p>}
        </ul>
      )}
    </section>
  );
}