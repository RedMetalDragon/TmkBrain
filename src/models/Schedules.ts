import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";

interface ScheduleAttributes {
    ScheduleID?: number;
    ScheduleName: string;
    TimeIn: string; 
    TimeOut: string; 
}

const Schedule = dbConnectCustomer.define('Schedule', {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ScheduleName: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    TimeIn: {
      type: DataTypes.TIME,
      allowNull: false
    },
    TimeOut: {
      type: DataTypes.TIME,
      allowNull: false
    }
}, {
  tableName: 'Schedule',
  timestamps: false // Disable auto-generating createdAt and updatedAt columns
});;

export { Schedule, ScheduleAttributes };