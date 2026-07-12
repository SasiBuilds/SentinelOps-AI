import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedoAlt,
} from "react-icons/fa";

function ActivityTimeline() {
  const activities = [
    {
      icon: <FaExclamationTriangle className="text-red-400" />,
      title: "Authentication API Down",
      time: "2 mins ago",
    },
    {
      icon: <FaRedoAlt className="text-yellow-400" />,
      title: "Auto Recovery Started",
      time: "1 min ago",
    },
    {
      icon: <FaCheckCircle className="text-green-400" />,
      title: "Payment Service Restored",
      time: "Just now",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="text-xl">{activity.icon}</div>

            <div>
              <h3 className="text-white">{activity.title}</h3>
              <p className="text-gray-400 text-sm">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityTimeline;