import { useEffect, useState } from "react";
import { getIncidents } from "../services/api";
function IncidentTable() {
  const [incidents, setIncidents] = useState([]);
  useEffect(() => {
  const fetchIncidents = async () => {
    try {
      const response = await getIncidents();
      console.log(response);
      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  fetchIncidents();
}, []);
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Incidents
      </h2>

      <table className="w-full text-left text-white">
        <thead>
  <tr className="text-cyan-400 border-b border-slate-700">
    <th className="pb-3">Title</th>
    <th className="pb-3">Service</th>
    <th className="pb-3">Severity</th>
    <th className="pb-3">Status</th>
  </tr>
</thead>
        <tbody>
  {incidents.map((incident) => (
    <tr
      key={incident.id}
      className="border-b border-slate-800 hover:bg-slate-800"
    >
      <td className="py-4 text-white">
        {incident.title}
      </td>

      <td className="text-white">
        {incident.service}
      </td>

      <td className="text-red-400 font-semibold">
        {incident.severity}
      </td>

      <td className="text-green-400 font-semibold">
        {incident.status}
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default IncidentTable;