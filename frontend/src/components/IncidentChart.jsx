import { useEffect, useState } from "react";
import { getIncidentStats } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function IncidentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchIncidentStats = async () => {
      try {
        const response = await getIncidentStats();

        console.log(response);

        const chartData = response.data.byStatus.map((item) => ({
          day: item.status,
          incidents: item.count,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch incident stats:", error);
      }
    };

    fetchIncidentStats();
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Incident Status Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
            allowDecimals={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="incidents"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncidentChart;