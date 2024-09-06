import * as pack from "../../package.json";

interface HealthCheckResponse {
  status: string;
  version: string;
  info: string;
  timestamp: string;
  env: string;
}
/* The `HealthCheckController` object contains a method `healthCheck` that returns a
`HealthCheckResponse` object. Here's a breakdown of what the method is doing: */

const HealthCheckController = {
  healthCheck(): HealthCheckResponse {
    const timestamp = new Date().toISOString();
    const { version } = pack;
    const env = process.env.NODE_ENV ?? "local";

    return {
      status: "up",
      version,
      info: "Service is healthy, all good",
      timestamp,
      env,
    };
  },
};

export { HealthCheckController, HealthCheckResponse };
