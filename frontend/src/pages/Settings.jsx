import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Settings() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-4xl font-bold text-cyan-400">
            Settings
          </h1>

          <div className="mt-8 bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="space-y-6">

              <div>
                <label className="text-white block mb-2">
                  Auto Recovery
                </label>

                <select className="w-full bg-slate-800 text-white p-3 rounded-lg">
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div>
                <label className="text-white block mb-2">
                  Alert Email
                </label>

                <input
                  className="w-full bg-slate-800 text-white p-3 rounded-lg"
                  placeholder="admin@company.com"
                />
              </div>

              <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg text-white">
                Save Settings
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;