import { NextFunction, Request, Response } from "express";
import { UsersController } from "../controllers";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, SECRET_KEY } from "../constants";
import { AuthAttributes } from "../models/Auth";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { CustomerAttributes } from "../models/Customer";
import { isNumeric, isValidDate } from "./helpers";
import { AttendanceController } from "../controllers/attendance.controller";

const UsersRestHandler = {
  getDashboardData(req: Request, res: Response): void {
    res.status(200).json(UsersController.getDashboardData());
  },

  async getAttendance(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const { employee_id, from, to } = req.query;

      if (employee_id !== undefined && Number.isNaN(Number(employee_id))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'employee_id'.`,
        );
      }

      if (from !== undefined && !isValidDate(String(from))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'from' date in yyyy-MM-dd format.`,
        );
      }

      if (to !== undefined && !isValidDate(String(to))) {
        throw new createHttpError.InternalServerError(
          `Please provide valid 'to' date in yyyy-MM-dd format.`,
        );
      }


      const attendance = await AttendanceController.getAttendance({
        employeeId: Number(employee_id),
        from: String(from),
        to: String(to),
      });

      res.status(200).json(attendance); 
    } catch (error) {
      next (error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const { username, password } = req.body;

      // Get salt from Auth table based on email_address
      const user = await UsersController.authenticate(username);

      if(user === null) {
        throw new createHttpError.InternalServerError(
          `Username does not exist in our records.`,
        );
      }

      const userHashedPassword = (user as unknown as AuthAttributes).PasswordHash;

      if (bcrypt.compareSync(password, userHashedPassword)) {
        // Passwords match, authentication successful
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const token = jwt.sign({ username: (user! as unknown as AuthAttributes).EmailAddress }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN.string });

        const userRole = (user as unknown as AuthAttributes).RoleID;
        const userID = (user as unknown as AuthAttributes).UserID;
        const userCustomerID = (user as unknown as AuthAttributes).CustomerID;

        const roleFeatures = await UsersController.getRole(userRole);
        const companyLogo = await UsersController.getCustomerDetails(userCustomerID);

        const personalData = await UsersController.getEmployeeData(userID);

        console.log(roleFeatures);

        res.status(200).json({    
          access_token: token, 
          expires_in: JWT_EXPIRES_IN.numeric,
          token_type: "Bearer",
          company_logo: (companyLogo as unknown as CustomerAttributes).CustomerLogo, 
          role_features: roleFeatures,
          personal_data: personalData,
        });
      } else {
        // Passwords don't match, authentication failed
        res.status(401).json({
          message: "Wrong email or password.",
          status: 401
        })
      }

    } catch (error) {
      next (error);
    }
  },

  async attendance(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)){
        throw new createHttpError.InternalServerError(
            `Please provide numeric employee ID.`,
          );
      }
    
      const employeeData = await UsersController.getEmployeeData(Number(employee_id));

      if (employeeData === null) {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`,
        );
      }

      const log = await UsersController.saveAttendance(Number(employee_id));

      if (log instanceof Error) {
        throw new createHttpError.InternalServerError(
            `Unable to save the employee attendance.`,
        );
      } else {
          res.status(200).json({
              message: "Successfully saved employee attendance.",
              status: 200
          });
      }
    } catch (error) {
      next (error);
    }     
  },

  async getLogs(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)){
        throw new createHttpError.InternalServerError(
            `Please provide numeric employee ID.`,
          );
      }
    
      const employeeData = await UsersController.getEmployeeData(Number(employee_id));

      if (employeeData === null) {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`,
        );
      }

      const logs = await UsersController.getLogs(Number(employee_id));

      res.status(200).json(logs);
    } catch (error) {
      next (error);
    }     
  },

  async getEmployees(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const employees = await UsersController.getEmployees();

      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  },

  async getEmployeeData(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if schedule_id is numeric
      if (!isNumeric(employee_id)){
        throw new createHttpError.InternalServerError(
            `Please provide numeric employee ID.`,
          );
      }
    
      const employeeData = await UsersController.getEmployeeData(Number(employee_id));

      if (employeeData !== null) {
        res.status(200).json(employeeData);
      } 
      else {
        throw new createHttpError.InternalServerError(
          `Employee ID does not exist in our record.`,
        );
      }
    } catch (error) {
      next(error);
    }
  },
};

export { UsersRestHandler };
