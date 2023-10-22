import { Request, Response } from "express";
import { BannerController } from "../controllers";

const BannersRestHandler = {
  getBanners(req: Request, res: Response): void {
    res.status(200).json(BannerController.getBanners());
  },
};

export { BannersRestHandler };
