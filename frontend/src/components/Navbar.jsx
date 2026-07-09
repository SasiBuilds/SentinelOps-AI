import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  return (
    <div className="flex items-center justify-between bg-slate-900 px-8 py-4 shadow-md border-b border-slate-700">

      {/* Left Section */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-sm text-gray-400">
          Monitor your infrastructure in real time
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Search Box */}
        <div className="flex items-center bg-slate-800 px-4 py-2 rounded-lg">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

        {/* Notification */}
        <button className="text-white text-xl hover:text-cyan-400 transition">
          <FaBell />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-cyan-400" />

          <div>
            <p className="text-white font-semibold">
              Admin
            </p>

            <p className="text-xs text-gray-400">
              DevOps Engineer
            </p>
          </div>
          <div className="flex items-center gap-4">
  <ProfileDropdown />
</div>
        </div>

      </div>

    </div>
  );
}

export default Navbar;