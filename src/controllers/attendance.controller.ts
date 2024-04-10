import { Model } from "sequelize";
import { CronHistory } from "../models/CronHistory";
import { Attendance } from "../models/Attendance";
import sequelize from "sequelize";

const AttendanceController = {
    async saveAttendance(attendance: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return await Attendance.create(attendance);
        } catch (error) {
            return error as Error;
        }
    },

    async saveCronHistory(cron: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return await CronHistory.create(cron);
        } catch (error) {
            return error as Error;
        }
    },

    async checkCronHistory(date: string): Promise<Record<any, any> | null> {
        return await CronHistory.findOne({
            where: {
                Date: sequelize.literal(`'${date}'`)
            }
        });
    },
};

export { AttendanceController };