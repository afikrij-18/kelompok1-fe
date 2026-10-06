import MiniCard from "./MiniCard";

export default function FleetSummary({ data }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-primary">Kesiapan Armada Teknisi</h2>
      <div className="flex gap-3">
        {/* Langkah 6.1: value = jumlah teknisi, label = status (siap/aktif/izin) */}
        {data.map((f) => (
          <MiniCard key={f.id} label={f.label} value={f.value} unit="orang" />
        ))}
      </div>
    </section>
  );
}