import { Model, Op } from "sequelize";
import { CronHistory } from "../models/CronHistory";
import { Attendance } from "../models/Attendance";
import { Employee } from "../models/Employee";
import { UNDEFINED_STRING } from "../constants";

const AttendanceController = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    async saveAttendance(attendance: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return await Attendance.create(attendance);
        } catch (error) {
            return error as Error;
        }
    },

    async getAttendance({
        employeeId,
        from,
        to,
    }: {
        employeeId?: number;
        from?: string;
        to?: string;
    }): Promise<Model<any, any>[] | null> { // eslint-disable-line @typescript-eslint/no-explicit-any 
        
        const where: {
            EmployeeID?: number;
            Date?: string | { [Op.gte]: string; } | { [Op.lte]: string; } | { [Op.between]: string[]; };
        } = {}

        if (!Number.isNaN(Number(employeeId))) {
            where.EmployeeID = employeeId;
        }

        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        if (from !== UNDEFINED_STRING && to !== UNDEFINED_STRING) {
            where.Date = {
                [Op.between]: [from!, to!],
            }
        }
        else if (from !== UNDEFINED_STRING) {
            where.Date = {
                [Op.gte]: from!
            }
        } 
        else if (to !== UNDEFINED_STRING) {
            where.Date = {
                [Op.lte]: to!
            }
        }
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        
        return await Attendance.findAll({
            attributes: [
                ["AttendanceID", "id"],
                ["Date", "date"],
                ["TimeIn", "time_in"],
                ["TimeOut", "time_out"],
                ["HoursRendered", "hours_rendered"],
                ["Tardiness", "tardiness"],
                ["OverTime", "overtime"],
                ["UnderTime", "undertime"],
                ["IsAbsent", "is_absent"],
                ["IsIncompleteLog", "is_incomplete_log"],
            ],
            include: [{ 
                model: Employee, 
                as: 'employee',
                attributes: [
                    ["EmployeeID", "employee_id"],
                    ["FirstName", "first_name"],
                    ["MiddleName", "middle_name"],
                    ["LastName", "last_name"],
                ]
            }],
            order: [
                ['Date', 'ASC']
            ],
            where,
        });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    async saveCronHistory(cron: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return await CronHistory.create(cron);
        } catch (error) {
            return error as Error;
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    async checkCronHistory(date: string): Promise<Record<any, any> | null> {
        return await CronHistory.findOne({
            where: {
                DateRun: date,
            }
        });
    }
};

export { AttendanceController };