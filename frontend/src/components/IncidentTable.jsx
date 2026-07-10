function IncidentTable() {
  const incidents = [
    {
      id: "INC001",
      service: "Authentication API",
      severity: "Critical",
      status: "Active",
    },
    {
      id: "INC002",
      service: "Payment Service",
      severity: "Medium",
      status: "Resolved",
    },
    {
      id: "INC003",
      service: "Database Cluster",
      severity: "High",
      status: "Recovering",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Incidents
      </h2>

      <table className="w-full text-left text-white">
        <thead>
  <tr className="text-cyan-400 border-b border-slate-700">
    <th className="pb-3">Incident</th>
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
      <td className="py-4 text-white">{incident.id}</td>

      <td className="text-white">{incident.service}</td>

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