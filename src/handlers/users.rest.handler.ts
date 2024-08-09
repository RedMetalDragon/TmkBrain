import { NextFunction, Request, Response } from "express";
import { UsersController } from "../controllers";

import { JWT_EXPIRES_IN } from "../constants";
import createHttpError from "http-errors";
import { isNumeric, isValidDate } from "./helpers";
import { AttendanceController } from "../controllers/attendance.controller";
import { UsersService } from "../services/users.service";
import {
  generateSaltPassword,
  generateStrongPassword,
} from "../utils/salt_password_gen";
import Joi from "joi";
import { AuthService } from "../services/auth.service";
import { ValidationService } from "../services/validation.service";

type ValidateEmailBody = {
  email_address: string;
};

export type CreateCustomerBody = {
  first_name: string;
  last_name: string;
  middle_name: string;
  email_address: string;
  address: string;
  stripe_id: string;
  password: string;
  paid_amount: number;
  plan_id: number;
};

export type EnrollEmployeeBody = {
  first_name: string;
  last_name: string;
  middle_name: string;
  email_address: string;
  birthday: string;
};

export type LoginBody = {
  email_address: string;
  password: string;
};

// Schema validations
const CreateCustomerBodySchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  middle_name: Joi.string().required(),
  email_address: Joi.string().email().required(),
  address: Joi.string().required(),
  stripe_id: Joi.string().required(),
  password: Joi.string().required(),
  paid_amount: Joi.number().required(),
  plan_id: Joi.number().required(),
});

const EnrollEmployeeBodySchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  middle_name: Joi.string().required(),
  email_address: Joi.string().email().required(),
  birthday: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Birthday must be in YYYY-MM-DD format.",
      "any.required": "Birthday is a required field.",
    }),
});

const LoginBodySchema = Joi.object({
  email_address: Joi.string().email().required(),
  password: Joi.string().required(),
});

const UsersRestHandler = {
  async validateEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email_address }: ValidateEmailBody = req.body;

      const emailAddressExist = await UsersService.doesEmailAddressExist(
        email_address
      );

      res.status(200).json({
        email_address,
        existing: emailAddressExist,
      });
    } catch (error) {
      next(error);
    }
  },

  async createCustomerAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        email_address,
        stripe_id,
        plan_id,
        password,
      }: CreateCustomerBody = req.body;

      // Validating inputs
      const { error } = CreateCustomerBodySchema.validate(req.body);

      if (error) {
        throw new createHttpError.InternalServerError(
          `Please check request schema. Please refer to the openAPI documentation for the right endpoint usage. - ${error}`
        );
      }

      await ValidationService.validateEmailAddress(email_address);
      await ValidationService.validateStripeId(stripe_id);
      await ValidationService.validatePlan(plan_id);

      // Processing inputs
      // Hashing customer password
      const [salt, hashedPassword] = generateSaltPassword(password);

      // Saving info in database
      if (
        (await UsersService.createCustomerTransaction(
          req.body,
          salt,
          hashedPassword
        )) === true
      ) {
        res.status(200).json({
          message: "Successfully created customer account.",
        });
      } else {
        throw new createHttpError.InternalServerError(
          `Unable to save customer account.`
        );
      }

      /*
      TODO: sending email notification via another service.
      */
    } catch (error) {
      next(error);
    }
  },

  async enrollEmployeeAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email_address }: EnrollEmployeeBody = req.body;

      // Validating inputs
      const { error } = EnrollEmployeeBodySchema.validate(req.body);

      if (error) {
        throw new createHttpError.InternalServerError(
          `Please check request schema. Please refer to the openAPI documentation for the right endpoint usage. - ${error}`
        );
      }

      await ValidationService.validateEmailAddress(email_address);

      // Processing inputs
      // Generate temporary password
      const randomPassword = generateStrongPassword();

      // Hash customer password
      const [salt, hashedPassword] = generateSaltPassword(randomPassword);

      // Save info in database
      if (
        (await UsersService.enrollEmployeeTransaction(
          req.body,
          salt,
          hashedPassword
        )) === true
      ) {
        res.status(200).json({
          message: "Successfully enrolled employee account.",
        });
      } else {
        throw new createHttpError.InternalServerError(
          `Unable to enroll employee account.`
        );
      }

      /*
      TODO: sending email notification via another service.
      */
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email_address }: LoginBody = req.body;

      // Validating inputs
      const { error } = LoginBodySchema.validate(req.body);

      if (error) {
        throw new createHttpError.InternalServerError(
          `Please check request schema. Please refer to the openAPI documentation for the right endpoint usage.`
        );
      }

      await AuthService.authenticate(req.body);
      const jwt = await AuthService.generateJWT(email_address);

      res.status(200).json({
        access_token: jwt,
        expires_in: JWT_EXPIRES_IN.numeric,
        token_type: "Bearer",
      });
    } catch (error) {
      next(error);
    }
  },

  // TODO: refactor below functions ...

  getDashboardData(req: Request, res: Response): void {
    res.status(200).json(UsersController.getDashboardData());
  },

  async getAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employee_id, from, to } = req.query;

      if (employee_id !== undefined && Number.isNaN(Number(employee_id))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'employee_id'.`
        );
      }

      if (from !== undefined && !isValidDate(String(from))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'from' date in yyyy-MM-dd format.`
        );
      }

      if (to !== undefined && !isValidDate(String(to))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'to' date in yyyy-MM-dd format.`
        );
      }

      const attendance = await AttendanceController.getAttendance({
        employeeId: Number(employee_id),
        from: String(from),
        to: String(to),
      });

      res.status(200).json(attendance);
    } catch (error) {
      next(error);
    }
  },

  async attendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)) {
        throw new createHttpError.InternalServerError(
          `Please provide numeric employee ID.`
        );
      }

      const employeeData = await UsersController.getEmployeeData(
        Number(employee_id)
      );

      if (employeeData === null) {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`
        );
      }

      const log = await UsersController.saveAttendance(Number(employee_id));

      if (log instanceof Error) {
        throw new createHttpError.InternalServerError(
          `Unable to save the employee attendance.`
        );
      } else {
        res.status(200).json({
          message: "Successfully saved employee attendance.",
          status: 200,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async getLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)) {
        throw new createHttpError.InternalServerError(
          `Please provide numeric employee ID.`
        );
      }

      const employeeData = await UsersController.getEmployeeData(
        Number(employee_id)
      );

      if (employeeData === null) {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`
        );
      }

      const logs = await UsersController.getLogs(Number(employee_id));

      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },

  async getEmployees(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employees = await UsersController.getEmployees();

      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)) {
        throw new createHttpError.InternalServerError(
          `Please provide numeric employee ID.`
        );
      }

      const employeeData = await UsersController.getEmployeeData(
        Number(employee_id)
      );

      if (employeeData !== null) {
        res.status(200).json(employeeData);
      } else {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`
        );
      }
    } catch (error) {
      next(error);
    }
  },
};

export { UsersRestHandler };
