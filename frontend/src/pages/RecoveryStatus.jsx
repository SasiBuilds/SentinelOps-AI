import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function RecoveryStatus() {
  const recoveries = [
    {
      id: "REC001",
      service: "Authentication API",
      action: "Restart Service",
      status: "Completed",
      duration: "35 sec",
    },
    {
      id: "REC002",
      service: "Payment Service",
      action: "Rollback Deployment",
      status: "In Progress",
      duration: "1 min",
    },
    {
      id: "REC003",
      service: "Database Cluster",
      action: "Scale Resources",
      status: "Completed",
      duration: "50 sec",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-4xl font-bold text-cyan-400">
            Recovery Status
          </h1>

          <p className="text-gray-400 mt-2">
            Monitor automated recovery operations.
          </p>

          <div className="mt-8 bg-slate-900 rounded-xl border border-slate-700 p-6">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-slate-700 text-cyan-400">
                  <th className="pb-3">Recovery ID</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Duration</th>
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
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoveryStatus;