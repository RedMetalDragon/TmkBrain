import { WhereOptions } from "sequelize";
import { Department, DepartmentAttributes } from "../models/Department";

const DepartmentService = {
  async createDepartment({
    department_name,
    description,
    division_id,
  }: {
    department_name: string;
    description?: string;
    division_id: number;
  }): Promise<Record<any, any> | Error> {
    try {
      const department = await Department.create({
        DepartmentName: department_name,
        Description: description || null,
        DivisionID: division_id,
      });

      const _department = department as unknown as DepartmentAttributes;

      return {
        department_id: _department.DepartmentID,
        department_name: _department.DepartmentName,
        description: _department.Description,
        division_id: _department.DivisionID,
      };
    } catch (error) {
      return error as Error;
    }
  },

  async getDepartments({
    division_id,
    department_id,
  }: {
    division_id?: number;
    department_id?: number;
  }): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    const where: WhereOptions = {};

    if (division_id !== undefined) {
      where.DivisionID = division_id;
    }

    if (department_id !== undefined) {
      where.DepartmentID = department_id;
    }

    const departments = await Department.findAll({
      where: { ...where },
    });

    // If a single department_id is requested, return one department, otherwise return all matching departments
    if (department_id !== undefined && departments.length > 0) {
      const _department = departments[0] as unknown as DepartmentAttributes;
      return {
        department_id: _department.DepartmentID,
        department_name: _department.DepartmentName,
        description: _department.Description,
        division_id: _department.DivisionID,
      };
    }

    return departments.map((department) => {
      const _department = department as unknown as DepartmentAttributes;
      return {
        department_id: _department.DepartmentID,
        department_name: _department.DepartmentName,
        description: _department.Description,
        division_id: _department.DivisionID,
      };
    });
  },

  async updateDepartment(
    department_id: number,
    updateData: Partial<{
      DepartmentName: string;
      Description: string;
      DivisionID: number;
    }>
  ): Promise<Record<string, unknown> | null | Error> {
    try {
      const department = await Department.findOne({
        where: { DepartmentID: department_id },
      });

      if (!department) {
        return null; // Department not found
      }

      await department.update(updateData);

      const _department = department as unknown as DepartmentAttributes;

      return {
        department_id: _department.DepartmentID,
        department_name: _department.DepartmentName,
        description: _department.Description,
        division_id: _department.DivisionID,
      };
    } catch (error) {
      return error as Error;
    }
  },

  async deleteDepartment(department_id: number): Promise<boolean | Error> {
    try {
      const department = await Department.findOne({
        where: { DepartmentID: department_id },
      });

      if (!department) {
        return false; // Department not found
      }

      await department.destroy();
      return true; // Successfully deleted
    } catch (error) {
      return error as Error;
    }
  },
};

export { DepartmentService };
