import { ValidationError } from "express-json-validator-middleware";
import createHttpError from "http-errors";

enum ErrorCodes {
  UNKNOWN_ERROR = 500,
  UNAUTHORIZED = 1001,
  NOT_FOUND = 1003,
  NOT_ACCEPTABLE = 1004,
  UNSUPPORTED_MEDIA_TYPE = 1005,
  VALIDATION_ERROR = 1006,
  CONFLICT = 1007,
}

export const defaultOccurrenceDetails: (
  error: ValidationError,
) => Record<string, unknown> = (error: ValidationError) => {
  return error.message ? { message: error.message } : {};
};

export type ProblemTypesDetails = {
  code: number;
  message: string;
  status: number;
  details?: string | ValidationError["validationErrors"];
};

export const defaultProblem = {
  details: {
    code: ErrorCodes.UNKNOWN_ERROR,
    message: "Unknown error occurred",
    status: 500,
  },
  occurrenceDetails: defaultOccurrenceDetails,
};

export const problemTypes = [
  {
    matchErrorClass: createHttpError.NotFound,
    details: {
      code: ErrorCodes.NOT_FOUND,
      message: "Object not found",
      status: 404,
    },
    occurrenceDetails: defaultOccurrenceDetails,
  },
  {
    matchErrorClass: createHttpError.NotAcceptable,
    details: {
      code: ErrorCodes.NOT_ACCEPTABLE,
      message: "Not Acceptable",
      status: 406,
    },
    occurrenceDetails: defaultOccurrenceDetails,
  },
  {
    matchErrorClass: createHttpError.UnsupportedMediaType,
    details: {
      code: ErrorCodes.UNSUPPORTED_MEDIA_TYPE,
      message: "Unsupported Media Type",
      status: 415,
    },
    occurrenceDetails: defaultOccurrenceDetails,
  },
  {
    matchErrorClass: createHttpError.UnprocessableEntity,
    details: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Invalid request body",
      status: 422,
    },
    occurrenceDetails: (error: Error): Record<string, unknown> => {
      return { details: error.message };
    },
  },
  {
    matchErrorClass: ValidationError,
    details: {
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Invalid request body",
      status: 422,
    },
    occurrenceDetails: (error: ValidationError): Record<string, unknown> => {
      return { details: error.validationErrors };
    },
  },
  {
    matchErrorClass: createHttpError.Conflict,
    details: {
      code: ErrorCodes.CONFLICT,
      message: "Conflict with existing data",
      status: 409,
    },
    occurrenceDetails: (error: Error): Record<string, unknown> => {
      return { details: error.message };
    },
  },
];
