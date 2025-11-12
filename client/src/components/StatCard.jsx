export default function StatCard({ title, count, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <h2 className="text-2xl font-semibold text-dark">{count}</h2>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
}
