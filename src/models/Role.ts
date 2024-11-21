import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";

interface RoleAttributes {
  RoleID?: number;
  RoleName: string;
  RoleDescription?: string;
}

const Role = dbConnect.define(
  "Role",
  {
    RoleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    RoleName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    RoleDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "Role",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { RoleAttributes, Role };
