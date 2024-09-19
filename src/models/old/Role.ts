import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";

interface RoleAttributes {
  RoleID?: number;
  Name?: string;
  Description?: string;
}

const Role = dbConnect.define("Role", {
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
