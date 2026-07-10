function ServiceHealth() {
  const services = [
    {
      name: "Authentication API",
      status: "Healthy",
      color: "bg-green-500",
    },
    {
      name: "Payment Service",
      status: "Warning",
      color: "bg-yellow-500",
    },
    {
      name: "Database Cluster",
      status: "Critical",
      color: "bg-red-500",
    },
    {
      name: "Notification Service",
      status: "Healthy",
      color: "bg-green-500",
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg mt-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Service Health
      </h2>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex justify-between items-center"
          >
            <span className="text-white">
              {service.name}
            </span>

            <span
              className={`${service.color} text-white px-3 py-1 rounded-full text-sm`}
            >
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceHealth;