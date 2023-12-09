import { Request, Response } from "express";
import { BannerController } from "../controllers";

const BannersRestHandler = {
  async getBanners(req: Request, res: Response): Promise<void> {
    const banners = await BannerController.getBanners();

    res.status(200).json(banners);
  },
};

export { BannersRestHandler };
