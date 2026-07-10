import {
  FaTachometerAlt,
  FaExclamationTriangle,
  FaRedoAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-cyan-400">
          SentinelOps AI
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          Disaster Recovery Platform
        </p>
      </div>

      <nav className="mt-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition"
        >
          <FaTachometerAlt />
          Dashboard
        </Link>

        <Link
          to="/incidents"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition"
        >
          <FaExclamationTriangle />
          Incidents
        </Link>

        <Link
          to="/recovery"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition"
        >
          <FaRedoAlt />
          Recovery
        </Link>

        <Link
          to="/analytics"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition"
        >
          <FaChartBar />
          Analytics
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 transition"
        >
          <FaCog />
          Settings
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;