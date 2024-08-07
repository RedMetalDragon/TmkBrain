import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Employee } from "./Employee";
import { Plan } from "./Plan";

interface CompanyPlanAttributes {
  CompanyPlanID?: number;
  EmployeeID: number;
  PlanID: number;
  IsActive: boolean;
  ActivationDate: string;
  ExpirationDate: string;
}

const CompanyPlan = dbConnect.define(
  "CompanyPlan",
  {
    CompanyPlanID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: "EmployeeID",
      },
    },
    PlanID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Plan,
        key: "PlanID",
      },
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    ActivationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ExpirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "CompanyPlan",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

CompanyPlan.belongsTo(Plan, { foreignKey: "PlanID", as: "plan" });

Employee.hasOne(CompanyPlan, {
  foreignKey: "CustomerID",
  as: "subscribed_plan",
});
CompanyPlan.belongsTo(Employee, { foreignKey: "EmployeeID", as: "customer" });

Plan.hasMany(CompanyPlan, {
  foreignKey: "PlanID",
  as: "customers_subscribed",
});

export { CompanyPlanAttributes, CompanyPlan };
