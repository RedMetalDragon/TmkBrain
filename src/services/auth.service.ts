import { Model } from "sequelize";
import { Auth } from "../models/Auth";

const AuthService = {
  async saveAuth(
    auth: Record<string, unknown>,
    transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Auth.create(auth, { transaction });
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  },
};

export { AuthService };
