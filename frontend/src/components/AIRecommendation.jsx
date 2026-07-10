import {
  FaRedoAlt,
  FaServer,
  FaBell,
  FaArrowUp,
} from "react-icons/fa";

function AIRecommendation() {
  const recommendations = [
    {
      icon: <FaRedoAlt className="text-cyan-400 text-xl" />,
      title: "Restart Authentication Service",
      status: "Recommended",
    },
    {
      icon: <FaServer className="text-green-400 text-xl" />,
      title: "Rollback Latest Deployment",
      status: "High Priority",
    },
    {
      icon: <FaArrowUp className="text-yellow-400 text-xl" />,
      title: "Scale API Pods (2 → 5)",
      status: "Suggested",
    },
    {
      icon: <FaBell className="text-red-400 text-xl" />,
      title: "Notify DevOps Team",
      status: "Immediate",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        AI Recovery Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-slate-800 p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              {item.icon}

              <div>
                <h3 className="text-white font-medium">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.status}
                </p>
              </div>
            </div>

            <button className="bg-cyan-500 hover:bg-cyan-600 transition px-4 py-2 rounded-lg text-white">
              Execute
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIRecommendation;