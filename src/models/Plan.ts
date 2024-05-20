import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";
import { CustomerPlan } from "./CustomerPlan";
import { Feature } from "./Feature";

interface PlanAttributes {
  PlanID?: number;
  PlanName: string;
  Description: string;
  IsActive: boolean;
  Price: number;
  CreationDate: string;
}

const Plan = dbConnect.define("Plan", {
  PlanID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PlanName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  Price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  CreationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Plan.hasMany(CustomerPlan, {
  foreignKey: "PlanID",
  as: "customers_subscribed",
});

Plan.hasMany(Feature, { foreignKey: "PlanID", as: "features" });

export { PlanAttributes, Plan };
