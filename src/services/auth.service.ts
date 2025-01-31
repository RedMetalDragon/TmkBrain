import { Model, Transaction } from "sequelize";
import { Auth, AuthAttributes } from "../models/Auth";
import { LoginBody } from "../handlers";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"; // Default to 1 hour if not set
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

  async authenticate(loginBody: LoginBody): Promise<Model<any, any>> {
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

    return userAuth;
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

    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined. Ensure it's set in the environment.");
    }
    const token = jwt.sign({ email_address: emailAddress }, SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return token;
  },
};

export { AuthService };
