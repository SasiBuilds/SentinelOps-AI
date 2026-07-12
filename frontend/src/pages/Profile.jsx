import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaUserCircle,
  FaEnvelope,
  FaUserShield,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Profile() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-cyan-400">
            Admin Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your SentinelOps AI account.
          </p>

          <div className="mt-8 bg-slate-900 rounded-xl border border-slate-700 p-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <FaUserCircle className="text-8xl text-cyan-400" />

              <h2 className="text-3xl font-bold text-white mt-4">
                Admin User
              </h2>

              <p className="text-gray-400">
                System Administrator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

              <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                <FaEnvelope className="text-cyan-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">admin@sentinelops.ai</p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                <FaUserShield className="text-cyan-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white">Administrator</p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                <FaPhone className="text-cyan-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">+91 98765 43210</p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                <FaMapMarkerAlt className="text-cyan-400 text-xl" />
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">Hyderabad, India</p>
                </div>
              </div>

            </div>

            <div className="mt-8 flex justify-center">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;