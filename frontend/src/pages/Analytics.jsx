import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", incidents: 18 },
  { month: "Feb", incidents: 25 },
  { month: "Mar", incidents: 14 },
  { month: "Apr", incidents: 30 },
  { month: "May", incidents: 20 },
  { month: "Jun", incidents: 10 },
  { month: "Jul", incidents: 15 },
];

function Analytics() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-4xl font-bold text-cyan-400">
            Analytics Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Monthly Incident Analytics
          </p>

          <div className="bg-slate-900 mt-8 rounded-xl border border-slate-700 p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="incidents" fill="#06b6d4" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;