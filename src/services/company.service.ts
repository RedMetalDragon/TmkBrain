import { Model, Transaction } from "sequelize";
import { Company } from "../models/Company";
import AWS from 'aws-sdk';

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

  async createCompanyBucket(bucketName: string): Promise<AWS.S3.CreateBucketOutput | Error> {
    try {
      const s3 = new AWS.S3();

      const params: AWS.S3.CreateBucketRequest = {
        Bucket: bucketName,
        ACL: 'private', // Change to 'public-read' if needed
      };
  
      const result = await s3.createBucket(params).promise();

      return result;
    } catch (error) {
      return error as Error;
    }
  }
};

export { CompanyService };
