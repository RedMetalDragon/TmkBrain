import { DataTypes } from "sequelize";
import connectDb from "../database/connection";

interface UserAccountAttributes {
  UserAccountID?: number;
  DivisionID: number;
  EmployeeID: number;
  Status?: string;
}

const UserAccount = connectDb.define('UserAccount', {
  UserAccountID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DivisionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EmployeeID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(50),
  },
});

export { UserAccount, UserAccountAttributes };
