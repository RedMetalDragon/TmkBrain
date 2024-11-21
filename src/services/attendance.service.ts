import { Model, Op } from "sequelize";
import { Attendance, AttendanceAttributes } from "../models/Attendance";
import createHttpError from "http-errors";

const AttendanceService = {
  async savePunchIn(
    timestamp: string,
    employeeId: number
  ): Promise<Model<any, any> | Error> {
    try {
      //Validate if there's an existing attendance record with no TimeOut yet
      const activeRecord = await Attendance.findOne({
        where: {
          EmployeeID: employeeId,
          TimeIn: {
            [Op.not]: null,
          },
          TimeOut: {
            [Op.is]: null,
          },
        },
      });

      if (activeRecord !== null) {
        throw new createHttpError.InternalServerError(
          `There's an existing attendance record for the employee with no time out yet. Please punch-out.`
        );
      }

      return await Attendance.create({
        TimeIn: timestamp,
        EmployeeID: employeeId,
      });
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  },

  async savePunchOut(
    timestamp: string,
    employeeId: number
  ): Promise<number | Error> {
    try {
      // Fetch the last attendance record with TimeOut as null for the employee
      const lastAttendance = await Attendance.findOne({
        where: {
          EmployeeID: employeeId,
          TimeOut: {
            [Op.is]: null,
          },
        },
        order: [["TimeIn", "DESC"]],
      });

      if (!lastAttendance) {
        throw new createHttpError.InternalServerError(
          `No active attendance record found.`
        );
      }

      const timeIn = new Date(
        (lastAttendance as unknown as AttendanceAttributes).TimeIn
      );
      const hrsRendered =
        (new Date(timestamp).getTime() - timeIn.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

      // Update the TimeOut and HoursRendered fields
      await lastAttendance.update({
        TimeOut: timestamp,
        HoursRendered: hrsRendered,
      });

      return hrsRendered;
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  },

  async getEmployeeAttendace(
    employeeId: number
  ): Promise<Record<any, any> | null> {
    const attendanceRecords = await Attendance.findAll({
      where: {
        EmployeeID: employeeId,
      },
    });

    return attendanceRecords.map((attendanceRecord) => {
      const _attendance = attendanceRecord as unknown as AttendanceAttributes;
      return {
        attendance_id: _attendance.AttendanceID,
        time_in: _attendance.TimeIn,
        time_out: _attendance.TimeOut,
        hours_rendered: _attendance.HoursRendered,
      };
    });
  },
};

export { AttendanceService };
