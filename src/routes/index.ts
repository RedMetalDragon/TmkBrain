import { Router } from "express";
import {
  HealthCheckRestHandler,
  BannersRestHandler,
  UsersRestHandler,
  SchedulesRestHandler,
  AttendanceRestHandler,
} from "../handlers";
import { PlansRestHandler } from "../handlers/plans.rest.handler";

const router = Router();

// Health Check
router.get("/health-check", HealthCheckRestHandler.healthCheck);

// Email Validator for Payment Service
router.post("/users/validate-email", UsersRestHandler.validateEmail);

// Creation of customer account
router.post("/users/register", UsersRestHandler.createCustomerAccount);

// Login
router.post("/users/login", UsersRestHandler.login);

// Get plans
router.get("/plans", PlansRestHandler.getPlans);

// TODO: refactor below endpoints ...

// Dashboard
router.get("/users/dashboard", UsersRestHandler.getDashboardData);

// Banners
router.get("/banners", BannersRestHandler.getBanners);

// Punch in/out
router.post("/employees/:employee_id/attendance", UsersRestHandler.attendance);
router.get("/employees/:employee_id/logs", UsersRestHandler.getLogs);
router.post(
  "/employees/attendance/compute",
  AttendanceRestHandler.computeAttendance
);

// Attendance
router.get("/employees/attendance", UsersRestHandler.getAttendance);

// List of employees
router.get("/users", UsersRestHandler.getEmployees);

// Employee data
router.get("/users/:employee_id", UsersRestHandler.getEmployeeData);

// Schedule CRUD
router.post("/schedule", SchedulesRestHandler.createSchedule);
router.get("/schedule", SchedulesRestHandler.listSchedule);
router.get("/schedule/:schedule_id", SchedulesRestHandler.readSchedule);
router.delete("/schedule/:schedule_id", SchedulesRestHandler.deleteSchedule);
router.put("/schedule/:schedule_id", SchedulesRestHandler.updateSchedule);

// Employee schedule assignment CRUD
router.post("/employee-schedules", SchedulesRestHandler.assignSchedule);
router.get("/employee-schedules", SchedulesRestHandler.getEmployeeSchedule);
router.get(
  "/employee-schedules/:employee_schedule_id",
  SchedulesRestHandler.getEmployeeScheduleById
);
router.delete(
  "/employee-schedules/:employee_schedule_id",
  SchedulesRestHandler.deleteEmployeeScheduleById
);
router.put(
  "/employee-schedules/:employee_schedule_id",
  SchedulesRestHandler.updateEmployeeScheduleById
);

// Get weekly and monthly schedule by ID
router.get(
  "/employees/:employee_id/weekly-schedule",
  SchedulesRestHandler.getEmployeeWeeklySchedule
);
router.get(
  "/employees/:employee_id/monthly-schedule",
  SchedulesRestHandler.getEmployeeMonthlySchedule
);

export { router };
