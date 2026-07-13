import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getAlerts } from "../services/api";

function AlertBanner() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await getAlerts();
        console.log(response);

        if (response.data && response.data.length > 0) {
          setAlert(response.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="bg-red-600 text-white rounded-xl p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-3">
        <FaExclamationCircle className="text-2xl" />

        <div>
          <h2 className="font-bold">
  {alert?.incident?.title || alert?.alertname || "No Active Alerts"}
</h2>

          <p className="text-sm">
  {alert?.annotations?.description || "System is operating normally."}
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