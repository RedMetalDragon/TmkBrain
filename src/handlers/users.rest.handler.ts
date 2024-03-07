import { NextFunction, Request, Response } from "express";
import { UsersController } from "../controllers";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, SECRET_KEY } from "../constants";
import { AuthAttributes } from "../models/Auth";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { CustomerAttributes } from "../models/Customer";
import { isNumeric } from "./helpers";

const UsersRestHandler = {
  getDashboardData(req: Request, res: Response): void {
    res.status(200).json(UsersController.getDashboardData());
  },

  getAttendance(req: Request, res: Response): void {
    res.status(200).json(UsersController.getAttendance());
  },

  getSchedule(req: Request, res: Response): void {
    res.status(200).json(UsersController.getSchedule());
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

  attendance(req: Request, res: Response): void {
    res.status(200).json(UsersController.attendance());
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
