import { NextFunction, Request, Response } from "express";
import { UsersController } from "../controllers";
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, SECRET_KEY } from "../constants";
import { AuthAttributes } from "../models/Auth";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

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
        const token = jwt.sign({ username: (user! as unknown as AuthAttributes).EmailAddress }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN.string });

        res.status(200).json({    
          access_token: token, 
          expires_in: JWT_EXPIRES_IN.numeric,
          token_type: "Bearer",
          company_logo: "logo:url"
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
};

export { UsersRestHandler };
