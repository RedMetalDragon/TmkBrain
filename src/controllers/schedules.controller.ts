import { Model } from "sequelize";
import { Employee } from "../models/Employee";
import { EmployeeSchedule, EmployeeScheduleAttributes } from "../models/EmployeeSchedules";
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
    
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async deleteSchedule(schedule_id: number): Promise<number> {
        return Schedule.destroy({
            where: {
                ScheduleID: schedule_id,
            }
        });    
    }, 

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async getEmployeeSchedule(employee_id: number): Promise<Model<any, any>[] | null> {
        return EmployeeSchedule.findAll({
            where: {
                EmployeeID: employee_id
            },
            attributes: [
                ['EmployeeScheduleID', 'employee_schedule_id'],
                ['ScheduleID', 'schedule_id'],
                ['EmployeeID', 'employee_id'],
                ['Workdays', 'workdays'],
            ]
        });
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async createEmployeeSchedule(employee_schedule: Record<string, unknown>): Promise<Model<any, any> | Error> {
        try {
            return EmployeeSchedule.create(employee_schedule);
        } catch (error) {
            return error as Error;
        }
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async getAssignedSchedule({employee_id, schedule_id}: {employee_id: number, schedule_id: number}): Promise<Record<any, any>[] | null> {
        let where = {};

        if (!isNaN(employee_id)) {
            where = {...where, EmployeeID: employee_id}
        }

        if (!isNaN(schedule_id)) {
            where = {...where, ScheduleID: schedule_id}
        }
        
        return EmployeeSchedule.findAll({
            include: [
                {
                    model: Employee, 
                    attributes: ['EmployeeID', 'FirstName', 'MiddleName', 'LastName']
                },
                {
                    model: Schedule,
                    attributes: ["ScheduleName"]
                }
            ],
            where,
        })
        .then(employeeSchedules => {
            if (employeeSchedules === null) {
                return null;
            }

            const resultArray: any[] = [];
            employeeSchedules.forEach(employeeSchedule => {
                const mappedEmployeeSchedule = {
                    employee_schedule_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).EmployeeScheduleID,
                    employee: {
                        employee_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).EmployeeID,
                        employee_fname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("FirstName"),
                        employee_mname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("MiddleName"),
                        employee_lname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("LastName"),
                    },
                    schedule: {
                        schedule_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).ScheduleID,
                        schedule_name: (employeeSchedule as unknown as EmployeeScheduleAttributes).Schedule.get("ScheduleName")
                    },
                    workdays: JSON.parse((employeeSchedule as unknown as EmployeeScheduleAttributes).Workdays),
                };

                resultArray.push(mappedEmployeeSchedule);
            });

            return resultArray;
        });
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async getAssignedScheduleById(employee_schedule_id: number): Promise<Record<any, any> | null> {
        return EmployeeSchedule.findOne({
            include: [
                {
                    model: Employee, 
                    attributes: ['EmployeeID', 'FirstName', 'MiddleName', 'LastName']
                },
                {
                    model: Schedule,
                    attributes: ["ScheduleName"]
                }
            ],
            where: {
                EmployeeScheduleID: employee_schedule_id
            },
        })
        .then(employeeSchedule => {
            if (employeeSchedule === null) {
                return null;
            }

            const mappedEmployeeSchedule = {
                employee_schedule_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).EmployeeScheduleID,
                employee: {
                    employee_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).EmployeeID,
                    employee_fname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("FirstName"),
                    employee_mname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("MiddleName"),
                    employee_lname: (employeeSchedule as unknown as EmployeeScheduleAttributes).Employee.get("LastName"),
                },
                schedule: {
                    schedule_id: (employeeSchedule as unknown as EmployeeScheduleAttributes).ScheduleID,
                    schedule_name: (employeeSchedule as unknown as EmployeeScheduleAttributes).Schedule.get("ScheduleName")
                },
                workdays: JSON.parse((employeeSchedule as unknown as EmployeeScheduleAttributes).Workdays),
            };

            return mappedEmployeeSchedule;
        });
    },

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    async deleteAssignedScheduleById(employee_schedule_id: number): Promise<number> {
        return EmployeeSchedule.destroy({
            where: {
                EmployeeScheduleID: employee_schedule_id,
            }
        });    
    }, 
};

export { SchedulesController };