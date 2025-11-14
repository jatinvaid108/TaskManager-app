export default function StatsCard({ title, value, color }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex flex-col gap-2">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
