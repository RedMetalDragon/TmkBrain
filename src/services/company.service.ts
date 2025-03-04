import { Model, Transaction } from "sequelize";
import { Company } from "../models/Company";

/* eslint-disable @typescript-eslint/no-explicit-any */
const CompanyService = {
  async saveCompany(
    company: Record<string, unknown>,
    transaction: Transaction
  ): Promise<Model<any, any> | Error> {
    try {
      return await Company.create(company, { transaction });
    } catch (error) {
      return error as Error;
    }
  },

  async doesCompanyExist(companyId: number): Promise<boolean> {
    const company = await Company.findOne({
      where: {
        CompanyID: companyId,
      },
    });

    return company !== null;
  },
};

export { CompanyService };
