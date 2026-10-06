export default function BookingChart({ data }) {
  const max = Math.max(...data.map((d) => d.booking));

  return (
    <section className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-4 text-lg font-semibold text-primary">Booking per Hari</h2>
      <div className="flex h-56 items-end gap-3">
        {data.map((d) => (
          <div key={d.hari} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-xs text-gray-500">{d.booking}</span>
            <div
              className="w-full rounded-t bg-secondary transition-colors hover:bg-primary"
              style={{ height: `${(d.booking / max) * 100}%` }}
              title={`${d.hari}: ${d.booking} booking`}
            />
            <span className="mt-2 text-xs">{d.hari}</span>
          </div>
        ))}
      </div>
    </section>
  );
}