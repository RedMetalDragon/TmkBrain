import { NextFunction, Request, Response } from "express";
import { convertTo12Hour, convertTo24Hour, validateTime } from "../utils/date-time-validation";
import createHttpError from "http-errors";
import { SchedulesController, UsersController } from "../controllers";
import { findDuplicates, getMonthDates, getWeekDates, getWeekdays, getWeekdaysOfMonth, isNumeric, validateUniqueDates } from "./helpers";
import { DEFAULT_SCHEDULE } from "../constants";

interface EmployeeSchedule {
    employee_id: number;
    schedule_id: number;
    workdays: string;
  };
  
const SchedulesRestHandler = {
    async createSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                schedule_name, 
                time_in,
                time_out
            } = req.body;
    
            // Validate time in and time out to be valid time format
            if (!validateTime(time_in) || !validateTime(time_out)){
                throw new createHttpError.InternalServerError(
                    `Please provide valid time in and out - (12H format, e.g. 08:00 am).`,
                );
            }

            const schedule = await SchedulesController.createSchedule({
                ScheduleName: schedule_name,
                TimeIn: convertTo24Hour(time_in),
                TimeOut: convertTo24Hour(time_out),
            })

            if (schedule instanceof Error) {
                throw new createHttpError.InternalServerError(
                    `Unable to save the schedule.`,
                );
            } else {
                res.status(200).json({
                    message: "Successfully saved schedule.",
                    status: 200
                });
            }            
        } catch (error) {
            next (error);
        }
    },    

    async updateSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                schedule_name, 
                time_in,
                time_out
            } = req.body;

            const { schedule_id } = req.params;
    
            // Validate if schedule_id is numeric
            if (!isNumeric(schedule_id)){
                throw new createHttpError.InternalServerError(
                    `Please provide numeric schedule ID.`,
                  );
            }

            // Validate time in and time out to be valid time format
            if (!validateTime(time_in) || !validateTime(time_out)){
                throw new createHttpError.InternalServerError(
                    `Please provide valid time in and out - (12H format, e.g. 08:00 am).`,
                );
            }

            const schedule = await SchedulesController.updateSchedule({
                ScheduleName: schedule_name,
                TimeIn: convertTo24Hour(time_in),
                TimeOut: convertTo24Hour(time_out),
            }, Number(schedule_id));

            if (schedule[0] === 0) {
                throw new createHttpError.InternalServerError(
                    `Unable to update the schedule.`,
                );
            } else {
                res.status(200).json({
                    message: "Successfully updated schedule.",
                    status: 200
                });
            }            
        } catch (error) {
            next (error);
        }
    },

    async deleteSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const { schedule_id } = req.params;

            // Validate if schedule_id is numeric
            if (!isNumeric(schedule_id)){
                throw new createHttpError.InternalServerError(
                    `Please provide numeric schedule ID.`,
                  );
            }

            const deletedSchedule = await SchedulesController.deleteSchedule(Number(schedule_id));

            if (deletedSchedule !== 0) {
                res.status(200).json({
                    message: "Successfully deleted schedule.",
                    status: 200
                });
            } 
            else {
                throw new createHttpError.InternalServerError(
                    `Error while deleting schedule.`,
                  );
            }
        } catch (error) {
            next (error);
        }
    },

    async readSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const { schedule_id } = req.params;

            // Validate if schedule_id is numeric
            if (!isNumeric(schedule_id)){
                throw new createHttpError.InternalServerError(
                    `Please provide numeric schedule ID.`,
                  );
            }

            const schedule = await SchedulesController.readSchedule(Number(schedule_id));

            if (schedule !== null) {
                res.status(200).json(schedule);
            } 
            else {
                throw new createHttpError.InternalServerError(
                  `Schedule ID does not exist in our record.`,
                );
            }

        } catch (error) {
            next (error);
        }
    },

    async listSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const schedules = await SchedulesController.listSchedule();

            let formattedSchedules;
            if (schedules !== null) {
                formattedSchedules = (schedules.map(schedule => ({
                    schedule_id: schedule.getDataValue("schedule_id"),
                    schedule_name: schedule.getDataValue("schedule_name"),
                    time_in: convertTo12Hour(schedule.getDataValue("time_in")),
                    time_out: convertTo12Hour(schedule.getDataValue("time_out"))
                  })));
            }
              
            res.status(200).json(schedules === null ? [] : formattedSchedules); 
        } catch (error) {
            next (error);
        }
    },

    async assignSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
          const {
            employee_id,
            schedule_id,
            workdays,
          } = req.body;
    
          // Validations: Employee id should be existing
          const employeeData = await UsersController.getEmployeeData(Number(employee_id));
    
          if (employeeData === null) {
            throw new createHttpError.InternalServerError(
              `Employee ID does not exist in our record.`,
            );
          }
    
          // Validations: Schedule id should be existing
          const schedule = await SchedulesController.readSchedule(Number(schedule_id));
    
          if (schedule === null) {
            throw new createHttpError.InternalServerError(
              `Schedule ID does not exist in our record.`,
            );
          }
    
          // Validations: Workdays should be an array of valid days. Each day should be unique.
          if ((workdays as Array<string>).length === 0){
            throw new createHttpError.InternalServerError(
              `Workdays can't be an empty array.`,
            );
          }
    
          if (!validateUniqueDates(workdays)) {
            throw new createHttpError.InternalServerError(
              `Dates inside workdays attribute should be valid dates in yyyy-MM-dd format. All dates should be unique.`,
            );
          }
    
          // Validations: Dates included in the workdays attribute should not exist in the database. There shoule be only 1 schedule assigned for a certain work day.
          /*
            1. Get all schedules under the same employee id.
            2. Merge arrays of all schedules of the employee.
            3. Compare the merged array to the upcoming workday array. Should have no overlapping dates.
            4. If there's an overlapping date, throw an error with the list of overlapping dates.
          */
          const employeeSchedules = await SchedulesController.getEmployeeSchedule({employee_id});
    
          let mergedWorkdays: string[] = [];
          if (employeeSchedules !== null) {
            employeeSchedules.forEach(employeeSchedule => {
                const workdaysArray = JSON.parse((employeeSchedule.dataValues as unknown as EmployeeSchedule).workdays);
    
                mergedWorkdays = [...mergedWorkdays, ...workdaysArray];
            });
          }
    
          const duplicateDates = findDuplicates(workdays, mergedWorkdays);
          if (duplicateDates.length !== 0) {
            throw new createHttpError.InternalServerError(
              `Employee already has an assigned schedule for the following dates: ${duplicateDates.join(', ')}`,
            );
          }
    
          // Save schedule assignment in DB
          /*
            1. Save in EmployeeSchedule table
            2. Return success/error message
          */
          const employeeSchedule = await SchedulesController.createEmployeeSchedule({
              EmployeeID: employee_id,
              ScheduleID: schedule_id,
              Workdays: JSON.stringify(workdays),
          })
    
          if (employeeSchedule instanceof Error) {
              throw new createHttpError.InternalServerError(
                  `Unable to save the employee schedule.`,
              );
          } else {
              res.status(200).json({
                  message: "Successfully saved employee schedule.",
                  status: 200
              });
          }               
        } catch (error) {
          next (error);
        } 
      },

    async getEmployeeSchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
    try {
      const {
        employee_id,
        schedule_id,
      } = req.query;

      if (employee_id !== undefined && !isNumeric(employee_id)) {
        throw new createHttpError.InternalServerError(
            `Please provide numeric employee ID.`,
          );
      }

      if (schedule_id !== undefined && !isNumeric(schedule_id)) {
        throw new createHttpError.InternalServerError(
            `Please provide numeric schedule ID.`,
          );
      }

      const employeeSchedule = await SchedulesController.getAssignedSchedule({
        employee_id: Number(employee_id),
        schedule_id: Number(schedule_id),
      });

      res.status(200).json(employeeSchedule);
    } catch (error) {
      next (error);
    }
    },

    async getEmployeeScheduleById(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                employee_schedule_id,
            } = req.params;

            if (!isNumeric(employee_schedule_id)) {
                throw new createHttpError.InternalServerError(
                    `Please provide numeric employee schedule ID.`,
                );
            }

            const employeeSchedule = await SchedulesController.getAssignedScheduleById(Number(employee_schedule_id));

            if (employeeSchedule !== null) {
                res.status(200).json(employeeSchedule);
            } 
            else {
                throw new createHttpError.InternalServerError(
                `Employee Schedule ID does not exist in our record.`,
                );
            }
        } catch (error) {
            next (error);
        }
      },
    
    async deleteEmployeeScheduleById(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                employee_schedule_id,
            } = req.params;

            if (!isNumeric(employee_schedule_id)) {
                throw new createHttpError.InternalServerError(
                    `Please provide numeric employee schedule ID.`,
                );
            }

            const deletedEmployeeSchedule = await SchedulesController.deleteAssignedScheduleById(Number(employee_schedule_id));

            if (deletedEmployeeSchedule !== 0) {
                res.status(200).json({
                    message: "Successfully deleted employee schedule.",
                    status: 200
                });
            } 
            else {
                throw new createHttpError.InternalServerError(
                    `Error while deleting employee schedule.`,
                  );
            }
        } catch (error) {
            next (error);
        }
      },
    
    async updateEmployeeScheduleById(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                employee_schedule_id,
            } = req.params;

            const {
                employee_id,
                schedule_id,
                workdays,
            } = req.body;

            // Validations: Employee_schedule_id should be existing and valid
            if (!isNumeric(employee_schedule_id)) {
                throw new createHttpError.InternalServerError(
                    `Please provide numeric employee schedule ID.`,
                );
            }
            const employeeScheduleData = await SchedulesController.getAssignedScheduleById(Number(employee_schedule_id));
        
            if (employeeScheduleData === null) {
                throw new createHttpError.InternalServerError(
                `Employee Schedule ID does not exist in our record.`,
                );
            }

            // Validations: Employee id should be existing
            const employeeData = await UsersController.getEmployeeData(Number(employee_id));
        
            if (employeeData === null) {
                throw new createHttpError.InternalServerError(
                `Employee ID does not exist in our record.`,
                );
            }
        
            // Validations: Schedule id should be existing
            const schedule = await SchedulesController.readSchedule(Number(schedule_id));
        
            if (schedule === null) {
                throw new createHttpError.InternalServerError(
                `Schedule ID does not exist in our record.`,
                );
            }
        
            // Validations: Workdays should be an array of valid days. Each day should be unique.
            if ((workdays as Array<string>).length === 0){
                throw new createHttpError.InternalServerError(
                `Workdays can't be an empty array.`,
                );
            }
        
            if (!validateUniqueDates(workdays)) {
                throw new createHttpError.InternalServerError(
                `Dates inside workdays attribute should be valid dates in yyyy-MM-dd format. All dates should be unique.`,
                );
            }
        
            // Validations: Dates included in the workdays attribute should not exist in the database. There shoule be only 1 schedule assigned for a certain work day.
            /*
                1. Get all schedules under the same employee id.
                2. Merge arrays of all schedules of the employee.
                3. Compare the merged array to the upcoming workday array. Should have no overlapping dates.
                4. If there's an overlapping date, throw an error with the list of overlapping dates.
            */
            const employeeSchedules = await SchedulesController.getEmployeeSchedule({employee_id, employee_schedule_id: Number(employee_schedule_id)});
        
            let mergedWorkdays: string[] = [];
            if (employeeSchedules !== null) {
                employeeSchedules.forEach(employeeSchedule => {
                    const workdaysArray = JSON.parse((employeeSchedule.dataValues as unknown as EmployeeSchedule).workdays);
        
                    mergedWorkdays = [...mergedWorkdays, ...workdaysArray];
                });
            }
        
            const duplicateDates = findDuplicates(workdays, mergedWorkdays);
            if (duplicateDates.length !== 0) {
                throw new createHttpError.InternalServerError(
                `Employee already has an assigned schedule for the following dates: ${duplicateDates.join(', ')}`,
                );
            }

            // Save schedule assignment in DB
            /*
                1. Update in EmployeeSchedule table
                2. Return success/error message
            */
            const updatedEmployeeSchedule = await SchedulesController.updateEmployeeSchedule({
                EmployeeID: employee_id,
                ScheduleID: schedule_id,
                Workdays: JSON.stringify(workdays),
            }, Number(employee_schedule_id));
    
            if (updatedEmployeeSchedule[0] === 0) {
                throw new createHttpError.InternalServerError(
                    `Unable to update the employee schedule.`,
                );
            } else {
                res.status(200).json({
                    message: "Successfully updated employee schedule.",
                    status: 200
                });
            }                
        } catch (error) {
            next (error);
        }
      },

    async getEmployeeWeeklySchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                employee_id
            } = req.params;

            if (employee_id !== undefined && !isNumeric(employee_id)) {
                throw new createHttpError.InternalServerError(
                    `Please provide numeric employee ID.`,
                );
            }

            // Validations: Employee id should be existing
            const employeeData = await UsersController.getEmployeeData(Number(employee_id));
        
            if (employeeData === null) {
                throw new createHttpError.InternalServerError(
                `Employee ID does not exist in our record.`,
                );
            }

            const employeeSchedule = await SchedulesController.getAssignedScheduleByEmployeeId(Number(employee_id));

            // If employee schedule is null (meaning, no custom shift assigned yet), return default schedule: Workdays | 8 am to 5 pm
            if (employeeSchedule.length === 0) {
                res.status(200).json([{
                    ...DEFAULT_SCHEDULE,
                    workdays: getWeekdays(),
                }]);
            }
            else {
                /*
                1. Filter by week
                2. Sort workdays
                */
                const weekSchedule = employeeSchedule?.map(item => {
                    const weekWorkdays = getWeekDates().filter(weekdates => item.workdays.includes(weekdates));    

                    if (weekWorkdays.length !== 0){
                        return {
                            ...item,
                            workdays: weekWorkdays.sort()
                        }
                    }
                }).filter(Boolean); // Filter out any null or undefined values

                res.status(200).json(weekSchedule);
            }
        } catch (error) {
            next (error);
        }
    },

    async getEmployeeMonthlySchedule(req: Request, res: Response, next: NextFunction,): Promise<void> {
        try {
            const {
                employee_id
            } = req.params;

            if (employee_id !== undefined && !isNumeric(employee_id)) {
                throw new createHttpError.InternalServerError(
                    `Please provide numeric employee ID.`,
                );
            }

            // Validations: Employee id should be existing
            const employeeData = await UsersController.getEmployeeData(Number(employee_id));
        
            if (employeeData === null) {
                throw new createHttpError.InternalServerError(
                `Employee ID does not exist in our record.`,
                );
            }

            const employeeSchedule = await SchedulesController.getAssignedScheduleByEmployeeId(Number(employee_id));

            // If employee schedule is null (meaning, no custom shift assigned yet), return default schedule: Workdays | 8 am to 5 pm
            if (employeeSchedule.length === 0) {
                res.status(200).json([{
                    ...DEFAULT_SCHEDULE,
                    workdays: getWeekdaysOfMonth(),
                }]);
            }
            else {
                /*
                1. Filter by month
                2. Sort workdays
                */
                const monthSchedule = employeeSchedule?.map(item => {
                    const monthWorkdays = getMonthDates().filter(monthDates => item.workdays.includes(monthDates));    

                    if (monthWorkdays.length !== 0){
                        return {
                            ...item,
                            workdays: monthWorkdays.sort()
                        }
                    }
                }).filter(Boolean); // Filter out any null or undefined values

                res.status(200).json(monthSchedule);
            }
        } catch (error) {
            next (error);
        }
    },
};

export { SchedulesRestHandler };