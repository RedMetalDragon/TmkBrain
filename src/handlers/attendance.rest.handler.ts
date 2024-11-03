import { NextFunction, Request, Response } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { SchedulesController, UsersController } from "../controllers";
import {
  getCurrentDate,
  getScheduledTimeIn,
  getTimeInAndOut,
  getTimeInAndOutNightShift,
  hoursDifference,
  isWeekend,
} from "./helpers";
import Joi from "joi/lib";
import { ValidationService } from "../services/validation.service";
import { AttendanceService } from "../services/attendance.service";
import createHttpError from "http-errors";

type PunchInOutBody = {
  timestamp: string;
};

// Schema validations
const PunchInOutBodySchema = Joi.object({
  timestamp: Joi.date().iso().required(),
});

interface TimeInAndOut {
  time_in: string;
  time_out: string;
  absent: boolean;
  incomplete_log: boolean;
}

/* eslint-disable  @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */
const AttendanceRestHandler = {
  async employeeLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { timestamp }: PunchInOutBody = req.body;
      const { employee_id } = req.params;

      // Validating inputs
      ValidationService.validateSchema(PunchInOutBodySchema, req.body);

      // Validate if employee_id is numeric
      ValidationService.validateEmployeeID(employee_id);

      // Save time-in
      const savedPunchIn = await AttendanceService.savePunchIn(
        timestamp,
        Number(employee_id)
      );

      if (savedPunchIn instanceof Error) {
        throw new createHttpError.InternalServerError(
          `Unable to save punch in. - ${savedPunchIn}`
        );
      } else {
        res.status(200).json({
          message: "Successfully saved log in time.",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async employeeLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { timestamp }: PunchInOutBody = req.body;
      const { employee_id } = req.params;

      // Validating inputs
      ValidationService.validateSchema(PunchInOutBodySchema, req.body);

      // Validate if employee_id is numeric
      ValidationService.validateEmployeeID(employee_id);

      // Save time-out
      const hrsRendered = await AttendanceService.savePunchOut(
        timestamp,
        Number(employee_id)
      );

      if (hrsRendered instanceof Error) {
        throw new createHttpError.InternalServerError(
          `Unable to save punch out. - ${hrsRendered}`
        );
      } else {
        res.status(200).json({
          message: `Successfully saved log out time. Total hours rendered for the day is ${hrsRendered} hours.`,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async employeeAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { employee_id } = req.params;

      // Validate if employee_id is numeric
      ValidationService.validateEmployeeID(employee_id);

      // Get attendance
      const attendance = await AttendanceService.getEmployeeAttendace(
        Number(employee_id)
      );

      res.status(200).json(attendance);
    } catch (error) {
      next(error);
    }
  },

  // TODO: refactor below functions ...

  async computeAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employees = await UsersController.getEmployees();
      const currentDate = getCurrentDate(1); // lead time of 1 day for attendance processing to give way for timezone differences
      const yesterday = getCurrentDate(2);

      console.log(`Cron processing: Attendance for ${currentDate}`);

      /* Check attendance table if current date has been computed already */
      const cronHistory = await AttendanceController.checkCronHistory(
        currentDate
      );

      if (cronHistory !== null) {
        console.log(`Cron already finished for ${currentDate}`);
        res
          .status(200)
          .json({ mesage: `Cron already finished for ${currentDate}.` });
      } else {
        // Loop through all employees
        for (const employee of employees!) {
          console.log(`Employee ID: ${employee.employee_id} ----------`);

          // Check first if employee has an assigned custom shift
          const employeeSchedule =
            await SchedulesController.getAssignedScheduleByEmployeeId(
              Number(employee.employee_id)
            );

          let timeInAndOut = {};
          let scheduledHours = 0;
          let scheduledDateTimeIn;

          // If employee schedule is null, use default schedule
          if (employeeSchedule.length === 0) {
            // Default schedule is day shift for Monday to Friday (8am to 5pm)
            // Check if current date is a workday
            if (isWeekend(currentDate)) {
              console.log(
                `No schedule for employee id ${employee.employee_id} for ${currentDate}. Default schedule used. Today is a weekend.`
              );
              continue;
            }

            // Get earliest and latest log for the day
            scheduledHours = 9; // inclusive of breaktime
            timeInAndOut = await getTimeInAndOut(
              currentDate,
              employee.employee_id
            );

            scheduledDateTimeIn = getScheduledTimeIn(currentDate, "08:00:00");
          }
          //
          else {
            // Get employee's assigend schedule for today
            const schedule = await SchedulesController.getScheduleForToday(
              employee.employee_id,
              currentDate
            );

            if (schedule === null) {
              console.log(
                `No schedule for employee id ${employee.employee_id} for ${currentDate}`
              );
              continue;
            } else {
              // Get shift (if day or overnight)
              const scheduledTimeIn = schedule!.dataValues.Schedule.TimeIn;
              const scheduledTimeOut = schedule!.dataValues.Schedule.TimeOut;

              // Parse the time strings into Date objects
              let timeIn = new Date(`2000-01-02T${scheduledTimeIn}`);
              const timeOut = new Date(`2000-01-02T${scheduledTimeOut}`);

              let shift = "Day";
              if (timeOut < timeIn) {
                shift = "Night";
              }

              // If day, get earliest and latest for the day
              if (shift === "Day") {
                timeInAndOut = await getTimeInAndOut(
                  currentDate,
                  employee.employee_id
                );
                scheduledDateTimeIn = getScheduledTimeIn(
                  currentDate,
                  scheduledTimeIn
                );
              }
              // If overnight, get earliest log yesterday and latest log today
              else {
                // Change time in to previous date
                timeIn = new Date(`2000-01-01T${scheduledTimeIn}`);
                timeInAndOut = await getTimeInAndOutNightShift(
                  yesterday,
                  currentDate,
                  employee.employee_id
                );
                scheduledDateTimeIn = getScheduledTimeIn(
                  yesterday,
                  scheduledTimeIn
                );
              }

              scheduledHours = hoursDifference(timeOut, timeIn);
            }
          }

          // To get hours rendered => out - in
          const renderedHours = hoursDifference(
            (timeInAndOut as any).time_out,
            (timeInAndOut as any).time_in
          );

          // To get tardiness => actual in - scheduled in
          let tardiness = hoursDifference(
            (timeInAndOut as any).time_in,
            new Date(scheduledDateTimeIn)
          );

          if (tardiness < 0) {
            tardiness = 0;
          }

          /* 
          To get undertime and overtime => total scheduled hrs - actual hrs rendered
          - If positive, undertime (e.g. 9hrs - 8hrs = 1hr undertime)
          - If negative, overtime (e.g. 9hrs - 10hrs = 1hr overtime)
          */
          const scheduledVsRendered = scheduledHours - renderedHours;

          let overtime = 0;
          let undertime = 0;
          if (scheduledVsRendered > 0) {
            undertime = scheduledVsRendered;
          } else {
            overtime = Math.abs(scheduledVsRendered);
          }

          console.log(timeInAndOut);
          console.log(`Hrs rendered: ${renderedHours}`);
          console.log(`Hrs scheduled: ${scheduledHours}`);
          console.log(`Scheduled In: ${scheduledDateTimeIn}`);
          console.log(`Tardiness: ${tardiness.toFixed(2)}`);
          console.log(`Overtime: ${overtime.toFixed(2)}`);
          console.log(`Undertime: ${undertime.toFixed(2)}`);

          console.log("Saving attendance ...");
          await AttendanceController.saveAttendance({
            Date: currentDate,
            TimeIn: (timeInAndOut as TimeInAndOut).time_in,
            TimeOut: (timeInAndOut as TimeInAndOut).time_out,
            HoursRendered: renderedHours,
            Tardiness: tardiness,
            OverTime: overtime,
            UnderTime: undertime,
            IsAbsent: (timeInAndOut as TimeInAndOut).absent,
            IsIncompleteLog: (timeInAndOut as TimeInAndOut).incomplete_log,
            EmployeeID: employee.employee_id,
          });
        }

        console.log("Saving cron audit trail ...");
        await AttendanceController.saveCronHistory({
          DateRun: currentDate,
        });

        res.status(200).json({ mesage: "Cron successfully finished." });
      }
    } catch (error) {
      next(error);
    }
  },
};

export { AttendanceRestHandler };
