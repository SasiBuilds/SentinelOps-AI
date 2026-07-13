import {
  httpRequestCounter,
  httpRequestDuration,
} from "../config/metrics.js";

export default function metricsMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    const route = req.route?.path || req.path;

    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
      },
      duration
    );
  });

  next();
}
