import { Customer } from "../models/Customer";

const UsersService = {
  async doesEmailAddressExist(emailAddress: string): Promise<boolean> {
    const user = await Customer.findOne({
      where: {
        Email: emailAddress,
      },
    });

    return user !== null;
  },
};

export { UsersService };
