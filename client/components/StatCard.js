export default function StatCard({ label, value, sub, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub ? (
        <span
          className={`badge mt-3 ${accents[accent] || accents.brand}`}
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}
