import { Model } from "sequelize";
import { Auth } from "../models/Auth";

const UsersController = {
  getDashboardData() {
    return {
        employee_fname: "x",
        employee_mname: "x",
        employee_lname: "x",
        company_name: "Company",
        company_logo: "logo:url",
        today_worked_hours: "03:00",
        today_scheduled_hours: "08:00",
        today_remaining_hours: "05:00",
        monthly_scheduled_hours: "216 hrs",
        monthly_worked_hours: "189 hrs",
        monthly_remaining_hours: "23 hrs",
        monthly_overtime_hours: "56 hrs"
    };
  },

  getAttendance() {
    return [
        {
            date: "2023-10-01",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-02",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-03",
            in: "08:00:00am",
            out: null
        }
    ];
  },

  getSchedule() {
    return [
        {
            date: "2023-10-01",
            in: "08:00:00am",
            out: "05:00:00pm",
            day: "Sunday",
            hours: "8 hours"
        },
        {
            date: "2023-10-02",
            in: "08:00:00am",
            out: "05:00:00pm",
            day: "Monday",
            hours: "8 hours"
        },
        {
            date: "2023-10-03",
            in: "08:00:00am",
            out: "05:00:00pm",
            day: "Tuesday",
            hours: "8 hours"
        },
        {
            date: "2023-10-04",
            in: "08:00:00am",
            out: "05:00:00pm",
            day: "Wednesday",
            hours: "8 hours"
        },
        {
            date: "2023-10-05",
            in: "08:00:00am",
            out: "05:00:00pm",
            day: "Thursday",
            hours: "8 hours"
        }
    ];
  },
  
  attendance() {
    return {    
        message: "Successfully recorded punch in / out.",
        status: 200
    }
  },

  async authenticate(username: string): Promise<Model<any, any> | null>  {
    return Auth.findOne({
        where: {
            EmailAddress: username,
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
  },
}

export { UsersController };
