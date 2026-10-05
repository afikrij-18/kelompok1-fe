export default function StatCard({ title, value, unit }) {
  return (
    <div className="flex min-h-32 flex-col justify-between rounded-xl border-l-4 border-primary bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-primary">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
}