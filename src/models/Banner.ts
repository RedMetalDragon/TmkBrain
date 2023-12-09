import { DataTypes } from "sequelize";
import { dbConnectCustomer } from "../database/connection";

interface BannerAttributes {
    BannerID: number;
    Description: string;
    Content: string;
    ImageSrc: string;
    CreatedDate: Date;
}

const Banner = dbConnectCustomer.define('Banners', {
    BannerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ImageSrc: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });

export { Banner, BannerAttributes };