import { Request } from "express";
import { HTTP } from "../constants";

export function getInteger(
  req: Request,
  key: string,
  allowNegative: boolean = true,
): number | undefined {
  const param = req.query[key];
  let value = Array.isArray(param) ? param[0] : param;
  if (typeof value === "string" && /^[-+]?\d+$/u.test(value)) {
    const int = parseInt(value, 10);
    return allowNegative ? int : int >= 0 ? int : undefined;
  }
  return undefined;
}

export function getString(req: Request, key: string): string | undefined {
  const param = req.query[key];
  let value = Array.isArray(param) ? param[0] : param;
  return typeof value === "string" && value !== "" ? value : undefined;
}

export function renderRequestLog(
  req: Request & { startMillis?: number },
): string {
  const now = new Date();
  req.startMillis = now.getTime();

  const logBuilder: string[] = [];

  const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress;

  logBuilder.push(
    `>>> INCOMING ${req.method} ${
      req.path
    } ${now.toISOString()} - ${JSON.stringify(ip)} [${
      req.headers["X-Request-ID"] as string
    }]`,
  );

  if (req.method === HTTP.GET) {
    logBuilder.push(`Query Params: ${JSON.stringify(req.query)}`);
  } else {
    logBuilder.push(`Body Params: ${JSON.stringify(req.body)}`);
  }

  return logBuilder.join("\n");
}

export function renderResponseLog(
  req: Request & { startMillis?: number },
  resBody: Record<string, unknown> | Array<Record<string, unknown>>,
  resHttpStatus: number,
  error?: Error,
): string {
  const logBuilder: string[] = [];

  let processingTime: number | string = "unknown";

  if (req.startMillis !== undefined) {
    processingTime = Date.now() - req.startMillis;
  }

  logBuilder.push(
    `<<< RESPONDING ${req.method} ${
      req.path
    } ${resHttpStatus} - ${processingTime} ms [${
      req.headers["X-Request-ID"] as string
    }]`,
  );

  if (req.method === HTTP.GET && Array.isArray(resBody)) {
    logBuilder.push(`Response items count: ${resBody.length}`);
  } else {
    logBuilder.push(`Response body: ${JSON.stringify(resBody)}`);
  }

  if (error) {
    if (error.stack !== undefined) {
      logBuilder.push(error.stack);
    } else {
      logBuilder.push(error.message);
    }
  }

  return logBuilder.join("\n");
}
