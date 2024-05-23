import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { Customer } from "./Customer";
import { Plan } from "./Plan";

interface CustomerPlanAttributes {
  CustomerPlanID?: number;
  CustomerID: number;
  PlanID: number;
  IsActive: boolean;
  ActivationDate: string;
  ExpirationDate: string;
}

const CustomerPlan = dbConnect.define(
  "CustomerPlan",
  {
    CustomerPlanID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "CustomerID",
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
      allowNull: false,
    },
    ExpirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "CustomerPlan",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

CustomerPlan.belongsTo(Plan, { foreignKey: "PlanID", as: "plan" });

Customer.hasOne(CustomerPlan, {
  foreignKey: "CustomerID",
  as: "subscribed_plan",
});
CustomerPlan.belongsTo(Customer, { foreignKey: "CustomerID", as: "customer" });

export { CustomerPlanAttributes, CustomerPlan };
