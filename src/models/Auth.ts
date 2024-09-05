import { DataTypes } from "sequelize";
import { dbConnect } from "../database/connection";

interface AuthAttributes {
  AuthID?: number;
  CustomerID: number;
  Email: string;
  Salt: string;
  PasswordHash?: string;
  PasswordResetToken?: string;
  PasswordResetTokenExpiration?: Date;
  KeepLoggedIn?: boolean;
  Status: string;
}

const Auth = dbConnect.define(
  "Auth",
  {
    AuthID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmployeeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Salt: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
    },
    PasswordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    PasswordResetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    KeepLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Active",
    },
  },
  {
    tableName: "Auth",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { Auth, AuthAttributes };
