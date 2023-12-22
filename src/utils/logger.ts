import { SPACE_CHARACTER } from "../constants";
import { createLogger, format, LoggerOptions, transports } from "winston";

const { combine, timestamp, prettyPrint, colorize, printf } = format;

let loggingOptions: LoggerOptions;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const isDeployed = ["prd", "stg", "dev"].includes(process.env.NODE_ENV!);
const NEWLINE_PATTERN = /\n/gmu;

if (isDeployed) {
  const myFormat = printf(
    ({ level, message, timestamp: ts }) =>
      /* eslint-disable @typescript-eslint/restrict-template-expressions */
      `${ts as string} [${level}]: ${
        (message as string)
          ? (message as string).replace(NEWLINE_PATTERN, SPACE_CHARACTER)
          : message
      }`,
    /* eslint-disable @typescript-eslint/restrict-template-expressions */
  );

  loggingOptions = {
    level: process.env.LOG_LEVEL ?? "verbose",
    // format: format.json(),
    format: combine(timestamp(), prettyPrint(), colorize(), myFormat),
    transports: [new transports.Console()],
  };
} else {
  const myFormat = printf(
    ({ level, message, timestamp: ts }) =>
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${ts as string} [${level}]: ${message}`,
  );

  loggingOptions = {
    level: process.env.LOG_LEVEL ?? "debug",
    format: combine(timestamp(), prettyPrint(), colorize(), myFormat),
    transports: [new transports.Console()],
  };
} // end else

const logger = createLogger(loggingOptions);

export { logger };
