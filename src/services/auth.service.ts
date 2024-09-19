import { Model, Transaction } from "sequelize";
import { Auth, AuthAttributes } from "../models/Auth";
import { LoginBody } from "../handlers";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY, JWT_EXPIRES_IN } from "../constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
const AuthService = {
  async saveAuth(
    auth: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Auth.create(auth, { transaction });
    } catch (error) {
      console.log(error);
      return error as Error;
    }
  },

  async authenticate(loginBody: LoginBody): Promise<void> {
    const userAuth = await this.getUserAuth(loginBody.email_address);

    if (userAuth !== null) {
      const userHashedPassword = (userAuth as unknown as AuthAttributes)
        .PasswordHash;

      if (!bcrypt.compareSync(loginBody.password, userHashedPassword)) {
        throw new createHttpError.Unauthorized(`Wrong email or password.`);
      }
    } else {
      throw new createHttpError.InternalServerError(
        `Email address does not exist in our records.`
      );
    }
  },

  async getUserAuth(emailAddress: string): Promise<Model<any, any> | null> {
    const userAuth = await Auth.findOne({
      where: {
        Email: emailAddress,
      },
    });

    return userAuth;
  },

  async generateJWT(emailAddress: string): Promise<string> {
    const token = jwt.sign({ email_address: emailAddress }, SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN.string,
    });

    return token;
  },
};

export { AuthService };
