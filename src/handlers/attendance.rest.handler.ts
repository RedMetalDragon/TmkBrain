import { NextFunction, Request, Response } from "express";
import { DEFAULT_SCHEDULE } from "../constants";
import { SchedulesController, UsersController } from "../controllers";
import { getCurrentDate, getScheduledTimeIn, getTimeInAndOut, getTimeInAndOutNightShift, getTimeZone, hoursDifference, isWeekend } from "./helpers";

const AttendanceRestHandler = {
    async computeAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {          
            const employees = await UsersController.getEmployees();
            const currentDate = getCurrentDate();
            const yesterday = getCurrentDate(1);

            console.log(`Cron processing: Attendance for ${currentDate}`);

            // TODO: Validate cron first
            /*
            Check attendance table if current date has been computed already 
            */

            // Loop through all employees
            for (const employee of employees!) {
                
                console.log(`Employee ID: ${employee.employee_id} ----------`);
                
                // Check first if employee has an assigned custom shift
                const employeeSchedule = await SchedulesController.getAssignedScheduleByEmployeeId(Number(employee.employee_id));

                let timeInAndOut = {};
                let scheduledHours = 0;
                let scheduledDateTimeIn;

                // If employee schedule is null, use default schedule
                if (employeeSchedule.length === 0) {
                    const schedule = DEFAULT_SCHEDULE;

                    // Default schedule is day shift for Monday to Friday (8am to 5pm)
                    
                    // Check if current date is a workday
                    if (isWeekend(currentDate)){
                        console.log(`No schedule for employee id ${employee.employee_id} for ${currentDate}. Default schedule used. Today is a weekend.`);
                        continue;
                    }

                    // Get earliest and latest log for the day
                    scheduledHours = 9; // inclusive of breaktime
                    timeInAndOut = await getTimeInAndOut(currentDate, employee.employee_id);

                    scheduledDateTimeIn = getScheduledTimeIn(currentDate, "08:00:00");
                } 
                // 
                else {
                    // Get employee's assigend schedule for today
                    const schedule = await SchedulesController.getScheduleForToday(employee.employee_id, currentDate);

                    if (schedule === null){
                        console.log(`No schedule for employee id ${employee.employee_id} for ${currentDate}`);
                        continue;
                    }
                    else {
                        // Get shift (if day or overnight)
                        const scheduledTimeIn = schedule!.dataValues.Schedule.TimeIn;
                        const scheduledTimeOut = schedule!.dataValues.Schedule.TimeOut;

                        // Parse the time strings into Date objects
                        let timeIn = new Date(`2000-01-02T${scheduledTimeIn}`);
                        let timeOut = new Date(`2000-01-02T${scheduledTimeOut}`);

                        let shift: string = "Day";
                        if (timeOut < timeIn) {
                            shift = "Night";
                        }

                        // If day, get earliest and latest for the day
                        if (shift === 'Day') {
                            timeInAndOut = await getTimeInAndOut(currentDate, employee.employee_id);

                            scheduledDateTimeIn = getScheduledTimeIn(currentDate, scheduledTimeIn);
                        }
                        // If overnight, get earliest log yesterday and latest log today
                        else {
                            // Change time in to previous date
                            timeIn = new Date(`2000-01-01T${scheduledTimeIn}`);

                            timeInAndOut = await getTimeInAndOutNightShift(yesterday, currentDate, employee.employee_id);

                            scheduledDateTimeIn = getScheduledTimeIn(yesterday, scheduledTimeIn);
                        }

                        scheduledHours = hoursDifference(timeOut, timeIn);
                    }
                }

                // To get hours rendered => out - in
                const renderedHours = hoursDifference((timeInAndOut as any).time_out, (timeInAndOut as any).time_in);

                // To get tardiness => actual in - scheduled in
                let tardiness = hoursDifference((timeInAndOut as any).time_in, new Date(scheduledDateTimeIn));
                
                if (tardiness < 0){
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
                }
                else {
                    overtime = Math.abs(scheduledVsRendered)
                }

                console.log(timeInAndOut);
                console.log(`Hrs rendered: ${renderedHours}`);
                console.log(`Hrs scheduled: ${scheduledHours}`);
                console.log(`Scheduled In: ${scheduledDateTimeIn}`);
                console.log(`Tardiness: ${tardiness.toFixed(2)}`);
                console.log(`Overtime: ${overtime.toFixed(2)}`);
                console.log(`Undertime: ${undertime.toFixed(2)}`);

                // TODO: Save in attendance
            }

            res.status(200).json({mesage: "testing"});
        } catch (error) {
          next(error);
        }
      },
};

export { AttendanceRestHandler }