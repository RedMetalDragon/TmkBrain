import { Request, Response } from "express";
import { UsersController } from "../controllers";

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

  login(req: Request, res: Response): void {
    res.status(200).json(UsersController.login());
  },

  attendance(req: Request, res: Response): void {
    res.status(200).json(UsersController.attendance());
  },
};

export { UsersRestHandler };
