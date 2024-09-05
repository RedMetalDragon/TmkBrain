import { DataTypes } from "sequelize";
import { dbConnect } from "../../database/connection";

interface JobTitleAttributes {
  JobTitleID?: number;
  JobTitleName: string;
  Description?: string;
  DivisionID: number;
  IsActive?: boolean;
}

const JobTitle = dbConnect.define("JobTitle", {
  JobTitleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  JobTitleName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
  },
  DivisionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
  },
});

export { JobTitle, JobTitleAttributes };
