import { FaRobot } from "react-icons/fa";

function AIRootCause() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <FaRobot className="text-cyan-400 text-2xl" />
        <h2 className="text-xl font-semibold text-white">
          AI Root Cause Analysis
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-red-400 font-semibold">
            Authentication API Failure
          </h3>

          <p className="text-gray-300 mt-2">
            AI detected abnormal CPU usage (95%) caused by excessive login
            requests. The service became unresponsive after resource exhaustion.
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-yellow-400 font-semibold">
            Confidence Score
          </h3>

          <div className="w-full bg-slate-700 rounded-full h-3 mt-3">
            <div className="bg-cyan-400 h-3 rounded-full w-[92%]"></div>
          </div>

          <p className="text-gray-400 mt-2">
            92% Confidence
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIRootCause;