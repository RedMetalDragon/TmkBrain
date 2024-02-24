import { Router } from "express";
import {
  HealthCheckRestHandler,
  BannersRestHandler,
  UsersRestHandler,
  SchedulesRestHandler
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

// List of employees
router.get("/users", UsersRestHandler.getUsers);

// Scheduling and assignment
router.post("/schedule", SchedulesRestHandler.createSchedule);
router.get("/schedule", SchedulesRestHandler.listSchedule);
router.get("/schedule/:schedule_id", SchedulesRestHandler.readSchedule);
router.delete("/schedule/:schedule_id", SchedulesRestHandler.deleteSchedule);
router.put("/schedule/:schedule_id", SchedulesRestHandler.updateSchedule);

export { router };
