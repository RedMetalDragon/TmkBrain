import { ValidationError } from "express-json-validator-middleware";
import { NextFunction, Request, Response } from "express";
import { defaultProblem, problemTypes } from "./errors";
import type { ProblemTypesDetails } from "./errors";
import { logger } from "../utils/logger";
import { renderResponseLog } from "../utils/req-res-helper";

function getProblemDetailsForError(
  error: Error | ValidationError,
): ProblemTypesDetails {
  const problemType = problemTypes.find((type) => {
    return error instanceof type.matchErrorClass;
  });

  const problem = problemType ? problemType : defaultProblem;
  const problemDetails = { ...problem.details };

  if (typeof problem.occurrenceDetails === "function") {
    Object.assign(
      problemDetails,
      problem.occurrenceDetails(error as ValidationError),
    );
  }

  return problemDetails;
}

export function problemDetailsResponseMiddleware(
  error: Error | ValidationError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    // already too late
    return next(error);
  }

  const problemDetails = getProblemDetailsForError(error);

  if (!problemDetails.status) {
    const httpError = error as unknown as { statusCode: number };
    problemDetails.status = httpError.statusCode || 500;
  }

  res.set("Content-Type", "application/problem+json");

  const { status, code, message, details } = problemDetails;

  const responseJson = {
    code,
    message,
    details,
  };

  logger.error(renderResponseLog(req, responseJson, status, error));

  res.status(status).json(responseJson);

  return next();
}
