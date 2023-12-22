import { Banner } from "../models/Banner";
import { Model } from "sequelize";

const BannerController = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  async getBanners():Promise<Model<any, any>[] | null> {
    return Banner.findAll({
      limit: 3,
      order: [['CreatedDate', 'DESC']],
      attributes: [
        ['BannerID', 'banner_id'],
        ['ImageSrc', 'banner_image_url'],
        ['Content', 'banner_description'],
        ['Description', 'banner_title'],
        ['CreatedDate', 'created_date']
      ]
    });
  }
};

export { BannerController };
