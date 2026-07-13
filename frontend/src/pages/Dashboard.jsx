import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatusCard from "../components/StatusCard";
import IncidentChart from "../components/IncidentChart";
import IncidentTable from "../components/IncidentTable";
import RecoveryTable from "../components/RecoveryTable";
import ServiceHealth from "../components/ServiceHealth";
import ActivityTimeline from "../components/ActivityTimeline";
import AIRootCause from "../components/AIRootCause";
import AIRecommendation from "../components/AIRecommendation";
import AlertBanner from "../components/AlertBanner";
import SystemMetrics from "../components/SystemMetrics";
import NotificationPanel from "../components/NotificationPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonCard from "../components/SkeletonCard";
import { getStats } from "../services/api";


function Dashboard() { 

const [loading, setLoading] = useState(true);
const [stats, setStats] = useState(null);
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getStats();
      console.log(data);
      setStats(data.data);
    } catch (error) {
      console.error("Backend not available", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
if (loading) {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <LoadingSpinner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}


  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 min-h-screen bg-slate-950">
        <Navbar />
        <div className="p-8 pb-0">
  <AlertBanner />
</div>

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-cyan-400">
            Welcome to SentinelOps AI
          </h1>

          <p className="text-gray-400 mt-2">
            AI-powered Disaster Detection & Recovery Platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <StatusCard
  title="Total Incidents"
  value={stats?.incidents?.total ?? 0}
  color="text-blue-400"
/>

<StatusCard
  title="Open Incidents"
  value={stats?.incidents?.open ?? 0}
  color="text-red-400"
/>

<StatusCard
  title="Total Alerts"
  value={stats?.alerts?.total ?? 0}
  color="text-yellow-400"
/>

<StatusCard
  title="Recovery Success Rate"
  value={`${stats?.recovery?.successRatePct ?? 0}%`}
  color="text-green-400"
/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <IncidentChart />
            <IncidentTable />
          </div>

          <div className="mt-8">
            <RecoveryTable />
            <div className="mt-8">
           <ServiceHealth />
          </div>
        <div className="mt-8">
         <ActivityTimeline />
        </div>
        <div className="mt-8">
        <AIRootCause />
        </div>
        <div className="mt-8">
       <AIRecommendation />
        </div>
        <div className="mt-8">
  <NotificationPanel />
</div>
        <div className="mt-8">
     <SystemMetrics />
       </div>
       </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;