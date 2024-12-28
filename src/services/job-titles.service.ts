import { WhereOptions } from "sequelize";
import { JobTitle, JobTitleAttributes } from "../models/JobTitle";

const JobTitleService = {
  async createJobTitle({
    job_title_name,
    description,
    department_id,
  }: {
    job_title_name: string;
    description?: string;
    department_id: number;
  }): Promise<Record<any, any> | Error> {
    try {
      const jobTitle = await JobTitle.create({
        JobTitleName: job_title_name,
        Description: description || null,
        DepartmentID: department_id,
        IsActive: true,
      });

      const _jobTitle = jobTitle as unknown as JobTitleAttributes;

      return {
        job_title_id: _jobTitle.JobTitleID,
        job_title_name: _jobTitle.JobTitleName,
        description: _jobTitle.Description,
        department_id: _jobTitle.DepartmentID,
        is_active: _jobTitle.IsActive,
      };
    } catch (error) {
      return error as Error;
    }
  },

  async getJobTitles({
    department_id,
    is_active,
    job_title_id,
  }: {
    department_id?: number;
    is_active?: boolean;
    job_title_id?: number;
  }): Promise<
    Record<string, unknown>[] | Record<string, unknown> | null | Error
  > {
    try {
      const where: WhereOptions = {};
      if (department_id !== undefined) {
        where.DepartmentID = department_id;
      }
      if (is_active !== undefined) {
        where.IsActive = is_active;
      }
      if (job_title_id !== undefined) {
        where.JobTitleID = job_title_id;
      }

      const jobTitles = job_title_id
        ? await JobTitle.findOne({ where })
        : await JobTitle.findAll({ where });

      if (job_title_id) {
        if (!jobTitles) return null;

        const _jobTitle = jobTitles as unknown as JobTitleAttributes;
        return {
          job_title_id: _jobTitle.JobTitleID,
          job_title_name: _jobTitle.JobTitleName,
          description: _jobTitle.Description,
          department_id: _jobTitle.DepartmentID,
          is_active: _jobTitle.IsActive,
        };
      }

      return (jobTitles as unknown[]).map((jobTitle) => {
        const _jobTitle = jobTitle as unknown as JobTitleAttributes;
        return {
          job_title_id: _jobTitle.JobTitleID,
          job_title_name: _jobTitle.JobTitleName,
          description: _jobTitle.Description,
          department_id: _jobTitle.DepartmentID,
          is_active: _jobTitle.IsActive,
        };
      });
    } catch (error) {
      return error as Error;
    }
  },

  async updateJobTitle(
    job_title_id: number,
    updateData: Partial<{
      JobTitleName: string;
      Description: string;
      DepartmentID: number;
      IsActive: boolean;
    }>
  ): Promise<Record<string, unknown> | null | Error> {
    try {
      const jobTitle = await JobTitle.findOne({
        where: { JobTitleID: job_title_id },
      });

      if (!jobTitle) {
        return null;
      }

      await jobTitle.update(updateData);

      const _jobTitle = jobTitle as unknown as JobTitleAttributes;
      return {
        job_title_id: _jobTitle.JobTitleID,
        job_title_name: _jobTitle.JobTitleName,
        description: _jobTitle.Description,
        department_id: _jobTitle.DepartmentID,
        is_active: _jobTitle.IsActive,
      };
    } catch (error) {
      return error as Error;
    }
  },

  async deleteJobTitle(job_title_id: number): Promise<boolean | Error> {
    try {
      const jobTitle = await JobTitle.findOne({
        where: { JobTitleID: job_title_id },
      });

      if (!jobTitle) {
        return false;
      }

      await jobTitle.destroy();
      return true;
    } catch (error) {
      return error as Error;
    }
  },
};

export { JobTitleService };
