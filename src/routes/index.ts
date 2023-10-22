import { Router } from "express";
import {  } from "../handlers/banners.rest.handler";
import {
  HealthCheckRestHandler,
  BannersRestHandler,
  UsersRestHandler
} from "../handlers";

const router = Router();

// Health Check
router.get("/health-check", HealthCheckRestHandler.healthCheck);

// Login
router.post("/users/login", UsersRestHandler.login);

// Dashboard
router.get("/users/dashboard", UsersRestHandler.getDashboardData);

// Banners
router.get("/banners", BannersRestHandler.getBanners);

// Punch in/out
router.post("/users/attendance", UsersRestHandler.attendance);

// Schedule
router.get("/users/schedule", UsersRestHandler.getSchedule);

// Attendance
router.get("/users/attendance", UsersRestHandler.getAttendance);

export { router };
