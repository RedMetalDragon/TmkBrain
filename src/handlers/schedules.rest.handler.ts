import { NextFunction, Request, Response } from "express";
import { convertTo12Hour, convertTo24Hour, validateTime } from "../utils/date-time-validation";
import createHttpError from "http-errors";
import { SchedulesController } from "../controllers";
import { isNumeric } from "./schedules.helper";

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

            res.status(200).json(schedule ?? []); 
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
};

export { SchedulesRestHandler };