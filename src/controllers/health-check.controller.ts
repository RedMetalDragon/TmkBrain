import * as pack from "../../package.json";

interface HealthCheckResponse {
  status: string;
  version: string;
  info: string;
  timestamp: string;
  env: string;
}

const HealthCheckController = {
  healthCheck(): HealthCheckResponse {
    const timestamp = new Date().toISOString();
    const { version } = pack;
    const env = process.env.NODE_ENV ?? "local";

    return {
      status: "up",
      version,
      info: "Service is healthy",
      timestamp,
      env,
    };
  },
};

export { HealthCheckController, HealthCheckResponse };
