function StatusCard({ title, value, color, subtitle }) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all">
      <h3 className="text-gray-400 text-sm">{title}</h3>

      <h1 className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </h1>

      <p className="text-gray-500 mt-3 text-sm">
        {subtitle}
      </p>
    </div>
  );
}

export default StatusCard;