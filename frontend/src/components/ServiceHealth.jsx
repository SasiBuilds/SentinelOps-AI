import { useEffect, useState } from "react";
import { getServiceHealth } from "../services/api";

function ServiceHealth() {
  const [health, setHealth] =useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getServiceHealth();
        console.log(response);
        setHealth(response.data);
      } catch (error) {
        console.error("Failed to fetch health:", error);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Service Health
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white">Database</span>
          <span
            className={`px-3 py-1 rounded-full text-sm text-white ${
              health?.database === "connected"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {health?.database}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white">AI Service</span>
          <span
            className={`px-3 py-1 rounded-full text-sm text-white ${
              health?.aiService === "available"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {health?.aiService}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white">Environment</span>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {health?.environment}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white">Overall Health</span>
          <span
            className={`px-3 py-1 rounded-full text-sm text-white ${
              health?.healthy ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {health?.healthy ? "Healthy" : "Unhealthy"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ServiceHealth;