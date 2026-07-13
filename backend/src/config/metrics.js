import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "sentinelops_",
});

const httpRequestCounter = new client.Counter({
  name: "sentinelops_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "sentinelops_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export {
  register,
  httpRequestCounter,
  httpRequestDuration,
};
