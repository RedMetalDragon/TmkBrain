import { WhereOptions } from "sequelize";
import { Division } from "../models/Division";

const DivisionService = {
  async getDivision({
    divisionId,
  }: {
    divisionId?: number;
  }): Promise<Record<any, any>> {
    let where: WhereOptions = {};
    if (divisionId !== undefined) {
      where = {
        DivisionID: divisionId,
      };
    }

    const divisions = await Division.findAll({
      where: {
        ...where,
      },
    });

    return divisions.map((division) => {
      const _division = division.get({ plain: true });
      return {
        division_id: _division.DivisionID,
        division_name: _division.DivisionName,
      };
    });
  },
};

export { DivisionService };
