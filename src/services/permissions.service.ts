import { Permission } from "../models/Permission";
import { Feature } from "../models/Feature";

const PermissionService = {
  async getUserPermissions(roleId: number): Promise<string[]> {
    const permissions = await Permission.findAll({
      where: {
        RoleID: roleId,
      },
      include: [
        {
          model: Feature,
          as: "features",
        },
      ],
    });

    console.log(permissions);


    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = permissions.reduce<string[]>((acc, permission) => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const names = (permission as any).features.map(
        (feature) => feature.FeatureName
      );
      return acc.concat(names); // Concatenate feature names to the accumulator
    }, []);

    return features;
  },
};

export { PermissionService };
