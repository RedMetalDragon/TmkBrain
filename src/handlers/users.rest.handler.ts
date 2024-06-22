import { NextFunction, Request, Response } from "express";
import { UsersController } from "../controllers";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, SECRET_KEY } from "../constants";
import { AuthAttributes } from "../models/old/Auth";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { CustomerAttributes } from "../models/old/Customer";
import { isNumeric, isValidDate } from "./helpers";
import { AttendanceController } from "../controllers/attendance.controller";
import { UsersService } from "../services/users.service";
import { PlanService } from "../services/plans.service";
import { generateSaltPassword } from "../utils/salt_password_gen";
import Joi from "joi";

type ValidateEmailBody = {
  email_address: string;
};

export type CreateCustomerBody = {
  name: string;
  contact_number: string;
  email_address: string;
  address: string;
  customer_stripe_id: string;
  password: string;
  paid_amount: number;
  plan_id: number;
};

// Schema validations
const CreateCustomerBodySchema = Joi.object({
  name: Joi.string().required(),
  contact_number: Joi.string().required(),
  email_address: Joi.string().email().required(),
  address: Joi.string().required(),
  customer_stripe_id: Joi.string().required(),
  password: Joi.string().required(),
  paid_amount: Joi.number().required(),
  plan_id: Joi.number().required(),
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
        customer_stripe_id,
        plan_id,
        password,
      }: CreateCustomerBody = req.body;

      // Validating inputs
      const { error } = CreateCustomerBodySchema.validate(req.body);

      if (error) {
        throw new createHttpError.InternalServerError(
          `Please check request schema. Please refer to the openAPI documentation for the right endpoint usage.`
        );
      }

      const emailAddressExist = await UsersService.doesEmailAddressExist(
        email_address
      );
      if (emailAddressExist) {
        throw new createHttpError.InternalServerError(
          `Email address already exists.`
        );
      }

      const customerStripeIdExist =
        await UsersService.doesCustomerStripeIdExist(customer_stripe_id);
      if (customerStripeIdExist) {
        throw new createHttpError.InternalServerError(
          `Customer Stripe ID already exists.`
        );
      }

      const plans = await PlanService.getPlan({ planId: plan_id });
      if (plans.length === 0) {
        throw new createHttpError.InternalServerError(
          `Plan ID does not exist.`
        );
      }

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

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;

      // Get salt from Auth table based on email_address
      const user = await UsersController.authenticate(username);

      if (user === null) {
        throw new createHttpError.InternalServerError(
          `Username does not exist in our records.`
        );
      }

      const userHashedPassword = (user as unknown as AuthAttributes)
        .PasswordHash;

      if (bcrypt.compareSync(password, userHashedPassword)) {
        // Passwords match, authentication successful
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const token = jwt.sign(
          { username: (user! as unknown as AuthAttributes).EmailAddress },
          SECRET_KEY,
          { expiresIn: JWT_EXPIRES_IN.string }
        );
        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        const userRole = (user as unknown as AuthAttributes).RoleID;
        const userID = (user as unknown as AuthAttributes).UserID;
        const userCustomerID = (user as unknown as AuthAttributes).CustomerID;

        const roleFeatures = await UsersController.getRole(userRole);
        const companyLogo = await UsersController.getCustomerDetails(
          userCustomerID
        );

        const personalData = await UsersController.getEmployeeData(userID);

        console.log(roleFeatures);

        res.status(200).json({
          access_token: token,
          expires_in: JWT_EXPIRES_IN.numeric,
          token_type: "Bearer",
          company_logo: (companyLogo as unknown as CustomerAttributes)
            .CustomerLogo,
          role_features: roleFeatures,
          personal_data: personalData,
        });
      } else {
        // Passwords don't match, authentication failed
        res.status(401).json({
          message: "Wrong email or password.",
          status: 401,
        });
      }
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
