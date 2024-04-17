import { NextFunction, Request, Response } from "express";
import { BannerController } from "../controllers";

const BannersRestHandler = {
  async getBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await BannerController.getBanners();

      res.status(200).json(banners);
    } catch (error) {
      next(error);
    }
  },
};

export { BannersRestHandler };
