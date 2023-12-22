import { DataTypes } from "sequelize";
import { dbConnectCore } from "../database/connection";

interface RoleAttributes {
  RoleID?: number;
  Name?: string;
  Description?: string;
}

const Role = dbConnectCore.define('Role', {
    RoleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING(200),
    },
});

export { Role, RoleAttributes };