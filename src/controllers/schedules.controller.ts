import { Model } from "sequelize";
import { Schedule } from "../models/Schedules";

const SchedulesController = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async createSchedule(schedule: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return Schedule.create(schedule);
        } catch (error) {
            return error as Error;
        } 
    },

    async updateSchedule(schedule: Record<string, unknown>, schedule_id: number): Promise<[number]> {
        return Schedule.update(schedule, {
            where: {
                ScheduleID: schedule_id,
            }
        });        
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async listSchedule(): Promise<Model<any, any>[] | null> {
        return Schedule.findAll({
            attributes: [
                ['ScheduleID', 'schedule_id'],
                ['ScheduleName', 'schedule_name'],
                ['TimeIn', 'time_in'],
                ['TimeOut', 'time_out'],
            ]
        });        
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async readSchedule(schedule_id: number): Promise<Model<any, any> | null> {
        return Schedule.findOne({
            where: {
                ScheduleID: schedule_id
            },
            attributes: [
                ['ScheduleID', 'schedule_id'],
                ['ScheduleName', 'schedule_name'],
                ['TimeIn', 'time_in'],
                ['TimeOut', 'time_out'],
            ]
        });    
    },
    
    async deleteSchedule(schedule_id: number): Promise<number> {
        return Schedule.destroy({
            where: {
                ScheduleID: schedule_id,
            }
        });    
    } 
};

export { SchedulesController };