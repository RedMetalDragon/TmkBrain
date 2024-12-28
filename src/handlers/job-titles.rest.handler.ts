import { NextFunction, Request, Response } from "express";
import { JobTitleService } from "../services/job-titles.service";
import { ValidationService } from "../services/validation.service";
import Joi from "joi";

const createJobTitleSchema = Joi.object({
  job_title_name: Joi.string().max(100).required(),
  description: Joi.string().max(255).allow(null, ""),
  department_id: Joi.number().integer().required(),
  is_active: Joi.boolean().optional(),
});

const updateJobTitleSchema = Joi.object({
  job_title_name: Joi.string().max(100).optional(),
  description: Joi.string().max(255).optional(),
  department_id: Joi.number().integer().optional(),
  is_active: Joi.boolean().optional(),
}).or("job_title_name", "description", "department_id", "is_active");

const getJobTitlesSchema = Joi.object({
  department_id: Joi.number().integer().optional(),
  is_active: Joi.boolean().optional(),
});

const JobTitlesRestHandler = {
  async createJobTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { job_title_name, description, department_id } = req.body;

      // Validating inputs
      ValidationService.validateSchema(createJobTitleSchema, req.body);

      // Validate if department_id is existing
      await ValidationService.validateDepartment(department_id);

      const jobTitle = await JobTitleService.createJobTitle({
        job_title_name,
        description,
        department_id,
      });

      res.status(201).json(jobTitle);
    } catch (error) {
      next(error);
    }
  },

  async getJobTitles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Retrieve query parameters for filtering, if any
      const { department_id, is_active } = req.query;

      // Validate query parameters if necessary
      ValidationService.validateSchema(getJobTitlesSchema, req.query);

      const filters = {
        department_id: department_id
          ? parseInt(department_id as string, 10)
          : undefined,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      };

      const jobTitles = await JobTitleService.getJobTitles(filters);

      res.status(200).json(jobTitles);
    } catch (error) {
      next(error);
    }
  },

  async getJobTitleById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract the job_title_id from the route parameters
      const { job_title_id } = req.params;

      // Validate the parameter if necessary
      ValidationService.validateJobTitleID(job_title_id);

      // Call the service to retrieve the job title
      const jobTitle = await JobTitleService.getJobTitles({
        job_title_id: Number(job_title_id),
      });

      if (!jobTitle) {
        res.status(404).json({ error: "Job title not found" });
      }

      res.status(200).json(jobTitle);
    } catch (error) {
      next(error);
    }
  },

  async updateJobTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { job_title_id } = req.params;
      const { job_title_name, description, department_id, is_active } =
        req.body;

      // Validate the job_title_id
      ValidationService.validateJobTitleID(job_title_id);

      // Validate inputs
      ValidationService.validateSchema(updateJobTitleSchema, req.body);

      // Validate if department_id is existing
      await ValidationService.validateDepartment(department_id);

      // Prepare update fields
      const updateData = {
        ...(job_title_name !== undefined && { JobTitleName: job_title_name }),
        ...(description !== undefined && { Description: description }),
        ...(department_id !== undefined && { DepartmentID: department_id }),
        ...(is_active !== undefined && { IsActive: is_active }),
      };

      // Call the service to update the job title
      const updatedJobTitle = await JobTitleService.updateJobTitle(
        Number(job_title_id),
        updateData
      );

      if (!updatedJobTitle) {
        res.status(404).json({ error: "Job title not found" });
      }

      res.status(200).json(updatedJobTitle);
    } catch (error) {
      next(error);
    }
  },

  async deleteJobTitle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { job_title_id } = req.params;

      // Validate the job_title_id
      ValidationService.validateJobTitleID(job_title_id);

      // Call the service to delete the job title
      const isDeleted = await JobTitleService.deleteJobTitle(
        Number(job_title_id)
      );

      if (!isDeleted) {
        res.status(404).json({ error: "Job title not found" });
      }

      res.status(200).json({ message: "Job title deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export { JobTitlesRestHandler };
