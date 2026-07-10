import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function IncidentStatus() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const incidents = [
    {
      id: "INC001",
      service: "Authentication API",
      severity: "Critical",
      status: "Active",
      time: "2 mins ago",
    },
    {
      id: "INC002",
      service: "Payment Service",
      severity: "High",
      status: "Recovering",
      time: "10 mins ago",
    },
    {
      id: "INC003",
      service: "Database Cluster",
      severity: "Medium",
      status: "Resolved",
      time: "25 mins ago",
    },
    {
      id: "INC004",
      service: "Notification Service",
      severity: "Low",
      status: "Active",
      time: "40 mins ago",
    },
  ];

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(search.toLowerCase()) ||
      incident.service.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severity === "All" || incident.severity === severity;

    return matchesSearch && matchesSeverity;
  });

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentIncidents = filteredIncidents.slice(firstIndex, lastIndex);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredIncidents.length / itemsPerPage)
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-4xl font-bold text-cyan-400">
            Incident Status
          </h1>

          <p className="text-gray-400 mt-2">
            Monitor all incidents detected by SentinelOps AI
          </p>

          <div className="flex gap-4 mt-8 mb-6">
            <input
              type="text"
              placeholder="Search by ID or Service..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />

            <select
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="border-b border-slate-700 text-cyan-400">
                  <th className="pb-3">Incident ID</th>
                  <th>Service</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Detected</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentIncidents.length > 0 ? (
                  currentIncidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="border-b border-slate-800 hover:bg-slate-800"
                    >
                      <td className="py-4">{incident.id}</td>

                      <td>{incident.service}</td>

                      <td
                        className={`font-semibold ${
                          incident.severity === "Critical"
                            ? "text-red-500"
                            : incident.severity === "High"
                            ? "text-orange-400"
                            : incident.severity === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {incident.severity}
                      </td>

                      <td
                        className={`font-semibold ${
                          incident.status === "Resolved"
                            ? "text-green-400"
                            : incident.status === "Recovering"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {incident.status}
                      </td>

                      <td>{incident.time}</td>

                      <td>
                        <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-400"
                    >
                      No incidents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
                disabled={currentPage === 1}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentStatus;