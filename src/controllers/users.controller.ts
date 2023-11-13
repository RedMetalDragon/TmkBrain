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
        last_punch_in: "2023-10-12 08:00:00am",
        last_punch_out: "2023-10-12 05:00:00pm",
        total_hours_worked: "8",
        remaining_pto_balance: "5",
        two_weeks_schedule: [
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
                out: "05:00:00pm"
            },
            {
                date: "2023-10-15",
                in: "08:00:00am",
                out: "05:00:00pm"
            }
        ]
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
            out: "05:00:00pm"
        },
        {
            date: "2023-10-04",
            in: "08:00:00am",
            out: "05:00:00pm"
        },
        {
            date: "2023-10-05",
            in: "08:00:00am",
            out: "05:00:00pm"
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
