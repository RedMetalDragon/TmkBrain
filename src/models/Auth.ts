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
    CustomerID: {
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
    },
    PasswordResetTokenExpiration: {
      type: DataTypes.DATE,
    },
    KeepLoggedIn: {
      type: DataTypes.BOOLEAN,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "Auth",
    timestamps: false, // Disable auto-generating createdAt and updatedAt columns
  }
);

export { Auth, AuthAttributes };
