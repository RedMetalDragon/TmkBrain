import { Router } from "express";
import {
  HealthCheckRestHandler,
  BannersRestHandler,
  UsersRestHandler,
  SchedulesRestHandler,
  AttendanceRestHandler,
} from "../handlers";
import { PlansRestHandler } from "../handlers/plans.rest.handler";
import { JobTitlesRestHandler } from "../handlers/job-titles.rest.handler";
import { DepartmentHandler } from "../handlers/departments.rest.handler";

const router = Router();

// Health Check
router.get("/health-check", HealthCheckRestHandler.healthCheck);

// Email Validator for Payment Service
router.post("/users/validate-email", UsersRestHandler.validateEmail);

// Creation of customer account
router.post("/users/register", UsersRestHandler.createCustomerAccount);

// Enrollment of employee account
router.post("/users/enroll", UsersRestHandler.enrollEmployeeAccount);

// Login
router.post("/users/login", UsersRestHandler.login);

// Get plans
router.get("/plans", PlansRestHandler.getPlans);

// Employee data
router.get("/users/:employee_id", UsersRestHandler.getEmployeeData);

// Employee attendance - login, logout, attendance
router.post("/users/:employee_id/login", AttendanceRestHandler.employeeLogin);
router.post("/users/:employee_id/logout", AttendanceRestHandler.employeeLogout);
router.get(
  "/users/:employee_id/punch-status",
  AttendanceRestHandler.employeeStatus
);
router.get(
  "/users/:employee_id/attendance",
  AttendanceRestHandler.employeeAttendance
);

// CRUD for job-title
router.post("/job-titles", JobTitlesRestHandler.createJobTitle);
router.get("/job-titles", JobTitlesRestHandler.getJobTitles);
router.get("/job-titles/:job_title_id", JobTitlesRestHandler.getJobTitleById);
router.patch("/job-titles/:job_title_id", JobTitlesRestHandler.updateJobTitle);
router.delete("/job-titles/:job_title_id", JobTitlesRestHandler.deleteJobTitle);

// CRUD for department
router.post("/departments", DepartmentHandler.createDepartment);
router.get("/departments", DepartmentHandler.getDepartments);
router.get("/departments/:department_id", DepartmentHandler.getDepartmentById);
router.patch("/departments/:department_id", DepartmentHandler.updateDepartment);
router.delete(
  "/departments/:department_id",
  DepartmentHandler.deleteDepartment
);

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
