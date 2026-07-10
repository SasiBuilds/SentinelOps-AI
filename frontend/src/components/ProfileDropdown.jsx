import { useState } from "react";
import { FaUserCircle, FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
      >
        <FaUserCircle className="text-2xl text-cyan-400" />
        <span>Admin</span>
        <FaChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-800"
          >
            <FaUser />
            Profile
          </Link>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;