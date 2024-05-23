import { Model, Op } from "sequelize";
import { convertTo12Hour } from "../utils/date-time-validation";
import { Employee } from "../models/old/Employee";
import {
  EmployeeSchedule,
  EmployeeScheduleAttributes,
} from "../models/old/EmployeeSchedules";
import { Schedule } from "../models/old/Schedules";
import { EmployeeLog } from "../models/old/EmployeeLog";
import sequelize from "sequelize";

/* eslint-disable @typescript-eslint/no-explicit-any */
const SchedulesController = {
  async createSchedule(
    schedule: Record<string, unknown>
  ): Promise<Model<any, any> | Error> {
    try {
      return await Schedule.create(schedule);
    } catch (error) {
      return error as Error;
    }
  },

  async updateSchedule(
    schedule: Record<string, unknown>,
    schedule_id: number
  ): Promise<[number]> {
    return Schedule.update(schedule, {
      where: {
        ScheduleID: schedule_id,
      },
    });
  },

  async listSchedule(): Promise<Model<any, any>[] | null> {
    return await Schedule.findAll({
      attributes: [
        ["ScheduleID", "schedule_id"],
        ["ScheduleName", "schedule_name"],
        ["TimeIn", "time_in"],
        ["TimeOut", "time_out"],
      ],
    });
  },

  async readSchedule(schedule_id: number): Promise<Model<any, any> | null> {
    return await Schedule.findOne({
      where: {
        ScheduleID: schedule_id,
      },
      attributes: [
        ["ScheduleID", "schedule_id"],
        ["ScheduleName", "schedule_name"],
        ["TimeIn", "time_in"],
        ["TimeOut", "time_out"],
      ],
    });
  },

  async deleteSchedule(schedule_id: number): Promise<number> {
    return await Schedule.destroy({
      where: {
        ScheduleID: schedule_id,
      },
    });
  },

  async getEmployeeSchedule({
    employee_id,
    employee_schedule_id,
  }: {
    employee_id: number;
    employee_schedule_id?: number;
  }): Promise<Model<any, any>[] | null> {
    let where = {};

    /* eslint-disable-next-line  @typescript-eslint/no-non-null-assertion */
    if (!isNaN(employee_schedule_id!)) {
      where = {
        ...where,
        EmployeeScheduleID: {
          [Op.ne]: employee_schedule_id,
        },
      };
    }

    return await EmployeeSchedule.findAll({
      where: {
        ...where,
        EmployeeID: employee_id,
      },
      attributes: [
        ["EmployeeScheduleID", "employee_schedule_id"],
        ["ScheduleID", "schedule_id"],
        ["EmployeeID", "employee_id"],
        ["Workdays", "workdays"],
      ],
    });
  },

  async createEmployeeSchedule(
    employee_schedule: Record<string, unknown>
  ): Promise<Model<any, any> | Error> {
    try {
      return await EmployeeSchedule.create(employee_schedule);
    } catch (error) {
      return error as Error;
    }
  },

  async updateEmployeeSchedule(
    employee_schedule: Record<string, unknown>,
    employee_schedule_id: number
  ): Promise<[number]> {
    return await EmployeeSchedule.update(employee_schedule, {
      where: {
        EmployeeScheduleID: employee_schedule_id,
      },
    });
  },

  async getAssignedSchedule({
    employee_id,
    schedule_id,
  }: {
    employee_id: number;
    schedule_id: number;
  }): Promise<Record<any, any>[] | null> {
    let where = {};

    if (!isNaN(employee_id)) {
      where = { ...where, EmployeeID: employee_id };
    }

    if (!isNaN(schedule_id)) {
      where = { ...where, ScheduleID: schedule_id };
    }

    return await EmployeeSchedule.findAll({
      include: [
        {
          model: Employee,
          attributes: ["EmployeeID", "FirstName", "MiddleName", "LastName"],
        },
        {
          model: Schedule,
          attributes: ["ScheduleName", "TimeIn", "TimeOut"],
        },
      ],
      where,
    }).then((employeeSchedules) => {
      if (employeeSchedules === null) {
        return null;
      }

      const resultArray: Record<string, unknown>[] = [];
      employeeSchedules.forEach((employeeSchedule) => {
        const mappedEmployeeSchedule = {
          employee_schedule_id: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).EmployeeScheduleID,
          employee: {
            employee_id: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).EmployeeID,
            employee_fname: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Employee.get("FirstName"),
            employee_mname: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Employee.get("MiddleName"),
            employee_lname: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Employee.get("LastName"),
          },
          schedule: {
            schedule_id: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).ScheduleID,
            schedule_name: (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Schedule.get("ScheduleName"),
            time_in: convertTo12Hour(
              (
                employeeSchedule as unknown as EmployeeScheduleAttributes
              ).Schedule.get("TimeIn")
            ),
            time_out: convertTo12Hour(
              (
                employeeSchedule as unknown as EmployeeScheduleAttributes
              ).Schedule.get("TimeOut")
            ),
          },
          workdays: JSON.parse(
            (employeeSchedule as unknown as EmployeeScheduleAttributes).Workdays
          ),
        };

        resultArray.push(mappedEmployeeSchedule);
      });

      return resultArray;
    });
  },

  async getAssignedScheduleById(
    employee_schedule_id: number
  ): Promise<Record<any, any> | null> {
    return EmployeeSchedule.findOne({
      include: [
        {
          model: Employee,
          attributes: ["EmployeeID", "FirstName", "MiddleName", "LastName"],
        },
        {
          model: Schedule,
          attributes: ["ScheduleName", "TimeIn", "TimeOut"],
        },
      ],
      where: {
        EmployeeScheduleID: employee_schedule_id,
      },
    }).then((employeeSchedule) => {
      if (employeeSchedule === null) {
        return null;
      }

      const mappedEmployeeSchedule = {
        employee_schedule_id: (
          employeeSchedule as unknown as EmployeeScheduleAttributes
        ).EmployeeScheduleID,
        employee: {
          employee_id: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).EmployeeID,
          employee_fname: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).Employee.get("FirstName"),
          employee_mname: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).Employee.get("MiddleName"),
          employee_lname: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).Employee.get("LastName"),
        },
        schedule: {
          schedule_id: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).ScheduleID,
          schedule_name: (
            employeeSchedule as unknown as EmployeeScheduleAttributes
          ).Schedule.get("ScheduleName"),
          time_in: convertTo12Hour(
            (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Schedule.get("TimeIn")
          ),
          time_out: convertTo12Hour(
            (
              employeeSchedule as unknown as EmployeeScheduleAttributes
            ).Schedule.get("TimeOut")
          ),
        },
        workdays: JSON.parse(
          (employeeSchedule as unknown as EmployeeScheduleAttributes).Workdays
        ),
      };

      return mappedEmployeeSchedule;
    });
  },

  async getAssignedScheduleByEmployeeId(
    employee_id: number
  ): Promise<Record<any, any>[]> {
    return await EmployeeSchedule.findAll({
      include: [
        {
          model: Employee,
          attributes: ["EmployeeID", "FirstName", "MiddleName", "LastName"],
        },
        {
          model: Schedule,
          attributes: ["ScheduleName", "TimeIn", "TimeOut"],
        },
      ],
      where: {
        EmployeeID: employee_id,
      },
    }).then((employeeSchedules) => {
      // Group Workday values by schedule_id
      const groupedSchedules = employeeSchedules.reduce(
        (
          acc: {
            schedule: {
              schedule_id: number;
              schedule_name: string;
              time_in: string;
              time_out: string;
            };
            workdays: string[];
          }[],
          schedule
        ) => {
          const schedule_id = (
            schedule as unknown as EmployeeScheduleAttributes
          ).ScheduleID;
          const schedule_name = (
            schedule as unknown as EmployeeScheduleAttributes
          ).Schedule.get("ScheduleName");
          const time_in = convertTo12Hour(
            (schedule as unknown as EmployeeScheduleAttributes).Schedule.get(
              "TimeIn"
            )
          );
          const time_out = convertTo12Hour(
            (schedule as unknown as EmployeeScheduleAttributes).Schedule.get(
              "TimeOut"
            )
          );
          const existingScheduleIndex = acc.findIndex(
            (item) => item.schedule.schedule_id === schedule_id
          );
          const workday = JSON.parse(
            (schedule as unknown as EmployeeScheduleAttributes).Workdays
          ) as string[]; // Parse the JSON string to an array

          if (existingScheduleIndex === -1) {
            acc.push({
              schedule: {
                schedule_id:
                  schedule_id! /* eslint-disable-line  @typescript-eslint/no-non-null-assertion */,
                schedule_name,
                time_in,
                time_out,
              },
              workdays: workday,
            });
          } else {
            acc[existingScheduleIndex].workdays =
              acc[existingScheduleIndex].workdays.concat(workday);
          }

          return acc;
        },
        []
      );

      return groupedSchedules;
    });
  },

  async deleteAssignedScheduleById(
    employee_schedule_id: number
  ): Promise<number> {
    return await EmployeeSchedule.destroy({
      where: {
        EmployeeScheduleID: employee_schedule_id,
      },
    });
  },

  async getScheduleForToday(
    employee_id: number,
    date: string
  ): Promise<Record<any, any> | null> {
    return await EmployeeSchedule.findOne({
      include: [
        {
          model: Schedule,
          attributes: ["ScheduleName", "TimeIn", "TimeOut"],
        },
      ],
      where: {
        EmployeeID: employee_id,
        Workdays: {
          [Op.like]: `%${date}%`,
        },
      },
    });
  },

  async getTimeInAndOut(
    date: string,
    employee_id: number
  ): Promise<Record<any, any> | null> {
    // Set the start and end of the current date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to the start of the day (00:00:00)
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day (23:59:59:999)

    return await EmployeeLog.findOne({
      attributes: [
        [sequelize.fn("min", sequelize.col("LogTime")), "time_in"],
        [sequelize.fn("max", sequelize.col("LogTime")), "time_out"],
      ],
      where: {
        EmployeeID: employee_id,
        LogTime: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  },
};

export { SchedulesController };
