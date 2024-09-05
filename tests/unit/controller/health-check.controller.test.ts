import { HealthCheckController } from "../../../src/controllers";

const healthCheck = HealthCheckController.healthCheck();

describe("health check controller", () => {
  it("should return healthy", () => {
    expect("up").toBe(healthCheck.status);
    expect("Service is healthy").toBe(healthCheck.info);
  });
});
