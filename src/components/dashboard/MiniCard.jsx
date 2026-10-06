export default function MiniCard({ label, value, unit }) {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-xl bg-white p-4 shadow">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-3 text-xl font-bold text-primary">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
}