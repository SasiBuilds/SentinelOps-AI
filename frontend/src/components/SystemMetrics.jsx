import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaNetworkWired,
} from "react-icons/fa";

function SystemMetrics() {
  const metrics = [
    {
      icon: <FaMicrochip className="text-cyan-400 text-2xl" />,
      title: "CPU Usage",
      value: "74%",
    },
    {
      icon: <FaMemory className="text-green-400 text-2xl" />,
      title: "Memory",
      value: "62%",
    },
    {
      icon: <FaHdd className="text-yellow-400 text-2xl" />,
      title: "Disk Usage",
      value: "81%",
    },
    {
      icon: <FaNetworkWired className="text-purple-400 text-2xl" />,
      title: "Network",
      value: "1.2 Gbps",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Live System Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg p-5 text-center hover:bg-slate-700 transition"
          >
            <div className="flex justify-center mb-3">
              {metric.icon}
            </div>

            <h3 className="text-gray-400 text-sm">
              {metric.title}
            </h3>

            <p className="text-3xl font-bold text-white mt-2">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SystemMetrics;