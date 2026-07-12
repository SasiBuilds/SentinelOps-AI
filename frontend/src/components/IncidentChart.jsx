import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", incidents: 2 },
  { day: "Tue", incidents: 4 },
  { day: "Wed", incidents: 3 },
  { day: "Thu", incidents: 6 },
  { day: "Fri", incidents: 2 },
  { day: "Sat", incidents: 1 },
  { day: "Sun", incidents: 5 },
];

function IncidentChart() {
  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Incident Trend (Last 7 Days)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="incidents"
            stroke="#06b6d4"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncidentChart;