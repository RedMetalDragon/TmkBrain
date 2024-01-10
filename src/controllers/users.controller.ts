import { Model } from "sequelize";
import { RoleFeature } from "../models/RoleFeature";
import { Auth } from "../models/Auth";
import { Feature, FeatureAttributes } from "../models/Feature";
import { Customer } from "../models/Customer";

const UsersController = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  getUsers(): Record<any, any>[] | null {
    return [
        {
            profile_picture: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
            full_name: "John Doe",
            employee_id: 1,
            status: "Part-time",
            department: "IT",
            shift: "Day",
            joining_date: "2023-01-01",
            role: "Employee"
        },
        {
            profile_picture: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
            full_name: "John Dela Cruz",
            employee_id: 2,
            status: "Part-time",
            department: "HR",
            shift: "Day",
            joining_date: "2023-01-01",
            role: "Employee"
        },
        {
            profile_picture: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
            full_name: "John Guzman",
            employee_id: 3,
            status: "Regular",
            department: "IT",
            shift: "Day",
            joining_date: "2023-01-01",
            role: "Employee"
        },
    ]
  },
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  getDashboardData(): Record<any, any> | null {
    return {
        employee_fname: "John",
        employee_mname: "Dela",
        employee_lname: "Cruz",
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  getAttendance(): Record<any, any>[] | null {
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
    ];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  getSchedule(): Record<any, any>[] | null {
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
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  attendance(): Record<any, any> | null {
    return {    
        message: "Successfully recorded punch in / out.",
        status: 200
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  async getRole(roleId: number): Promise<Record<any, any>[] | null> {
    return RoleFeature.findAll({
        where: {
            RoleID: roleId,
            IsEnabled: true,
        },
        attributes: [],
        include: [
            {
                model: Feature,
                attributes: ['FeatureID', 'FeatureName'],
                where: {
                    IsActive: true
                }
            }
        ]
    })
    .then(roleFeatures => {
        // Use map to transform the result
        const transformedResult = roleFeatures.map(roleFeature => ({
          id: (roleFeature as unknown as FeatureAttributes).Feature.get('FeatureID'),
          name: (roleFeature as unknown as FeatureAttributes).Feature.get('FeatureName')
        }));
      
        return transformedResult;
      });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  async getCustomerDetails(customerID: number): Promise<Record<any, any> | null> {
    return Customer.findOne({
        where: {
            CustomerID: customerID,
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
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
