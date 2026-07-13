import { useEffect, useState } from "react";
import { getRecovery } from "../services/api";
function RecoveryTable() {
  const [recoveries, setRecoveries] = useState([]);

  useEffect(() => {
    const fetchRecovery = async () => {
      try {
        const response = await getRecovery();
        console.log(response);
        setRecoveries(response.data);
      } catch (error) {
        console.error("Failed to fetch recovery data:", error);
      }
    };

    fetchRecovery();
  }, []);

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recovery Status
      </h2>

      <table className="w-full text-left text-white">
  <thead>
    <tr className="border-b border-slate-700 text-cyan-400">
      <th className="pb-3">ID</th>
      <th className="pb-3">Service</th>
      <th className="pb-3">Action</th>
      <th className="pb-3">Status</th>
    </tr>
  </thead>

  <tbody>
    {recoveries.map((item) => (
      <tr
        key={item.id}
        className="border-b border-slate-800 hover:bg-slate-800"
      >
        <td className="py-4">{item.id.slice(0, 8)}</td>

        <td>{item.targetService}</td>

        <td>{item.action}</td>

        <td
          className={`font-semibold ${
            item.status === "SUCCESS"
              ? "text-green-400"
              : item.status === "FAILED"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {item.status}
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
);
}

export default RecoveryTable;