import MiniCard from "./MiniCard";

export default function WorkloadStats({ data }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-primary">Statistik Booking & Beban Kerja Armada</h2>
      <div className="flex flex-wrap gap-3">
        {data.map((w) => (
          <MiniCard key={w.id} label={w.label} value={w.value} unit={w.unit} />
        ))}
      </div>
    </section>
  );
}