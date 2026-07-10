import { FaBell } from "react-icons/fa";

function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      title: "Authentication API Down",
      message: "Critical incident detected.",
      time: "2 min ago",
      color: "border-red-500",
    },
    {
      id: 2,
      title: "Recovery Completed",
      message: "Payment Service restored successfully.",
      time: "8 min ago",
      color: "border-green-500",
    },
    {
      id: 3,
      title: "High CPU Usage",
      message: "Database Cluster reached 90% CPU.",
      time: "15 min ago",
      color: "border-yellow-500",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-cyan-400 text-2xl" />
        <h2 className="text-xl font-semibold text-white">
          Notifications
        </h2>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`border-l-4 ${item.color} bg-slate-800 p-4 rounded-lg`}
          >
            <h3 className="text-white font-semibold">
              {item.title}
            </h3>

            <p className="text-gray-400 mt-1">
              {item.message}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel;