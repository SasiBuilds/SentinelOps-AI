import { FaExclamationCircle } from "react-icons/fa";

function AlertBanner() {
  return (
    <div className="bg-red-600 text-white rounded-xl p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-3">
        <FaExclamationCircle className="text-2xl" />

        <div>
          <h2 className="font-bold">
            Critical Incident Detected
          </h2>

          <p className="text-sm">
            Authentication API is currently unavailable.
          </p>
        </div>
      </div>

      <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
        View Incident
      </button>
    </div>
  );
}

export default AlertBanner;