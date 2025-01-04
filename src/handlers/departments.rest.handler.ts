import { NextFunction, Request, Response } from "express";
import { ValidationService } from "../services/validation.service";
import Joi from "joi";
import { DepartmentService } from "../services/departments.service";

const createDepartmentSchema = Joi.object({
  department_name: Joi.string().max(100).required(),
  description: Joi.string().max(255).optional(),
  division_id: Joi.number().integer().required(),
});

const getDepartmentsSchema = Joi.object({
  division_id: Joi.number().integer().optional(),
});

const updateDepartmentSchema = Joi.object({
  department_name: Joi.string().max(100).optional(),
  description: Joi.string().max(255).optional(),
  division_id: Joi.number().integer().positive().optional(),
}).or("department_name", "description", "division_id");

const DepartmentHandler = {
  async createDepartment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { department_name, description, division_id } = req.body;

      // Validating inputs
      ValidationService.validateSchema(createDepartmentSchema, req.body);

      // Validate if division_id exists
      await ValidationService.validateDivision(division_id);

      const department = await DepartmentService.createDepartment({
        department_name,
        description,
        division_id,
      });

      res.status(201).json(department);
    } catch (error) {
      next(error);
    }
  },

  async getDepartments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Retrieve query parameters for filtering, if any
      const { division_id } = req.query;

      // Validate query parameters if necessary
      ValidationService.validateSchema(getDepartmentsSchema, req.query);

      const filters = {
        division_id: division_id
          ? parseInt(division_id as string, 10)
          : undefined,
      };

      const departments = await DepartmentService.getDepartments(filters);

      res.status(200).json(departments);
    } catch (error) {
      next(error);
    }
  },

  async getDepartmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract the department_id from the route parameters
      const { department_id } = req.params;

      // Validate the parameter if necessary
      ValidationService.validateDepartmentID(department_id);

      // Call the service to retrieve the department
      const department = await DepartmentService.getDepartments({
        department_id: Number(department_id),
      });

      if (
        !department ||
        (Array.isArray(department) && department.length === 0)
      ) {
        res.status(404).json({ error: "Department not found" });
        return;
      }

      res.status(200).json(department);
    } catch (error) {
      next(error);
    }
  },

  async updateDepartment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { department_id } = req.params;
      const { department_name, description, division_id } = req.body;

      // Validate the department_id
      ValidationService.validateDepartmentID(department_id);

      // Validate inputs
      ValidationService.validateSchema(updateDepartmentSchema, req.body);

      // Validate if division_id is existing
      await ValidationService.validateDivision(division_id);

      // Prepare update fields
      const updateData = {
        ...(department_name !== undefined && {
          DepartmentName: department_name,
        }),
        ...(description !== undefined && { Description: description }),
        ...(division_id !== undefined && { DivisionID: division_id }),
      };

      // Call the service to update the department
      const updatedDepartment = await DepartmentService.updateDepartment(
        Number(department_id),
        updateData
      );

      if (!updatedDepartment) {
        res.status(404).json({ error: "Department not found" });
        return;
      }

      res.status(200).json(updatedDepartment);
    } catch (error) {
      next(error);
    }
  },

  async deleteDepartment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { department_id } = req.params;

      // Validate the department_id
      ValidationService.validateDepartmentID(department_id);

      // Call the service to delete the department
      const isDeleted = await DepartmentService.deleteDepartment(
        Number(department_id)
      );

      if (!isDeleted) {
        res.status(404).json({ error: "Department not found" });
        return;
      }

      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export { DepartmentHandler };
