function RecoveryTable() {
  const recoveries = [
    {
      id: "REC001",
      service: "Authentication API",
      action: "Restarted Service",
      status: "Success",
    },
    {
      id: "REC002",
      service: "Payment Service",
      action: "Rollback Deployment",
      status: "Completed",
    },
    {
      id: "REC003",
      service: "Database Cluster",
      action: "Auto Scaling",
      status: "In Progress",
    },
  ];

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
              <td className="py-4">{item.id}</td>
              <td>{item.service}</td>
              <td>{item.action}</td>
              <td className="text-green-400 font-semibold">
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