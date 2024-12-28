import { WhereOptions } from "sequelize";
import { Department, DepartmentAttributes } from "../models/Department";

const DepartmentService = {
  async getDepartment({
    departmentId,
  }: {
    departmentId?: number;
  }): Promise<Record<any, any>> {
    let where: WhereOptions = {};
    if (departmentId !== undefined) {
      where = {
        DepartmentId: departmentId,
      };
    }

    const departments = await Department.findAll({
      where: {
        ...where,
      },
    });

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
};

export { DepartmentService };
